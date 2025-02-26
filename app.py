from flask import Flask, render_template, request, jsonify
import numpy as np
import json
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/simulate', methods=['POST'])
def simulate():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        num_flips = int(data.get('num_flips', 1000))
        korona_prob = float(data.get('korona_probability', 0.5))
        
        # Έλεγχος παραμέτρων
        if num_flips <= 0:
            return jsonify({"error": "Ο αριθμός ρίψεων πρέπει να είναι θετικός"}), 400
        if korona_prob < 0 or korona_prob > 1:
            return jsonify({"error": "Η πιθανότητα πρέπει να είναι μεταξύ 0 και 1"}), 400
        
        # Προσομοίωση (True για Κορώνα, False για Γράμματα)
        results = np.random.random(num_flips) < korona_prob
        
        # Δημιουργία λίστας με "Κ" και "Γ"
        flip_results = ["Κ" if res else "Γ" for res in results[:100]]  # Περιορισμός στις πρώτες 100 για καλύτερη απεικόνιση
        
        # Υπολογισμός των ποσοστών
        korona_count = np.sum(results)
        grammata_count = num_flips - korona_count
        
        korona_percentage = (korona_count / num_flips) * 100
        grammata_percentage = (grammata_count / num_flips) * 100
        
        # Υπολογισμός τρέχοντος μέσου όρου κορώνας μετά από κάθε ρίψη
        running_totals = np.cumsum(results)
        running_percentages = (running_totals / np.arange(1, num_flips + 1)) * 100
        
        # Για λόγους απόδοσης, μειώνουμε το δείγμα για μεγάλες προσομοιώσεις
        if num_flips > 10000:
            indices = np.linspace(0, num_flips-1, 5000, dtype=int)
            running_percentages = running_percentages[indices]
            x_values = indices + 1
        else:
            x_values = np.arange(1, num_flips + 1)
        
        return jsonify({
            'flip_results': flip_results,
            'korona_count': int(korona_count),
            'grammata_count': int(grammata_count),
            'korona_percentage': float(korona_percentage),
            'grammata_percentage': float(grammata_percentage),
            'running_percentages': running_percentages.tolist(),
            'x_values': x_values.tolist(),
            'theoretical': float(korona_prob * 100)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
