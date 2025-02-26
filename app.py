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
    data = request.get_json()
    num_trials = data.get('num_trials', 1000)
    prob = data.get('probability', 0.5)
    
    # Simulate coin tosses (1 for heads, 0 for tails)
    results = np.random.random(num_trials) < prob
    
    # Calculate running averages
    running_totals = np.cumsum(results)
    running_averages = running_totals / np.arange(1, num_trials + 1)
    
    # For performance reasons, downsample for large simulations
    if num_trials > 10000:
        indices = np.linspace(0, num_trials-1, 10000, dtype=int)
        running_averages = running_averages[indices]
        x_values = indices + 1
    else:
        x_values = np.arange(1, num_trials + 1)
    
    return jsonify({
        'averages': running_averages.tolist(),
        'x_values': x_values.tolist(),
        'theoretical': prob
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
