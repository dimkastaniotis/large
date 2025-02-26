from flask import Flask, render_template, request, jsonify
import numpy as np
import json
import os
import time

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
            
        num_trials = int(data.get('num_trials', 1000))
        prob = float(data.get('probability', 0.5))
        
        # Έλεγχος παραμέτρων
        if num_trials <= 0:
            return jsonify({"error": "Number of trials must be positive"}), 400
        if prob < 0 or prob > 1:
            return jsonify({"error": "Probability must be between 0 and 1"}), 400
        
        # Προσομοίωση (1 για επιτυχία, 0 για αποτυχία)
        results = np.random.random(num_trials) < prob
        
        # Υπολογισμός τρεχόντων μέσων όρων
        running_totals = np.cumsum(results)
        running_averages = running_totals / np.arange(1, num_trials + 1)
        
        # Για λόγους απόδοσης, μειώνουμε το δείγμα για μεγάλες προσομοιώσεις
        if num_trials > 10000:
            indices = np.linspace(0, num_trials-1, 5000, dtype=int)
            running_averages = running_averages[indices]
            x_values = indices + 1
        else:
            x_values = np.arange(1, num_trials + 1)
        
        return jsonify({
            'averages': running_averages.tolist(),
            'x_values': x_values.tolist(),
            'theoretical': prob
        })
    except Exception as e:
        app.logger.error(f"Error in simulation: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
