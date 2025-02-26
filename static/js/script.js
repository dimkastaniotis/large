document.addEventListener('DOMContentLoaded', function() {
    const probabilitySlider = document.getElementById('probability');
    const probabilityValue = document.getElementById('probability-value');
    const numTrialsSelect = document.getElementById('num-trials');
    const runSimulationButton = document.getElementById('run-simulation');
    const resultText = document.getElementById('result-text');
    
    // Ενημέρωση της τιμής πιθανότητας όταν αλλάζει το slider
    probabilitySlider.addEventListener('input', function() {
        probabilityValue.textContent = this.value;
    });
    
    // Αρχικοποίηση του γραφήματος
    const plot = document.getElementById('simulation-plot');
    Plotly.newPlot(plot, [{
        x: [0],
        y: [0],
        mode: 'lines',
        name: 'Τρέχων μέσος όρος'
    }, {
        x: [0],
        y: [0],
        mode: 'lines',
        line: {
            dash: 'dash',
            color: 'red'
        },
        name: 'Θεωρητική πιθανότητα'
    }], {
        title: 'Νόμος των Μεγάλων Αριθμών - Προσομοίωση',
        xaxis: {
            title: 'Αριθμός δοκιμών'
        },
        yaxis: {
            title: 'Ποσοστό επιτυχιών',
            range: [0, 1]
        },
        hovermode: 'closest'
    });
    
    // Εκτέλεση προσομοίωσης
    runSimulationButton.addEventListener('click', function() {
        runSimulation();
    });
    
    async function runSimulation() {
        runSimulationButton.disabled = true;
        runSimulationButton.textContent = 'Εκτέλεση...';
        resultText.textContent = 'Εκτελείται η προσομοίωση...';
        
        try {
            const probability = parseFloat(probabilitySlider.value);
            const numTrials = parseInt(numTrialsSelect.value);
            
            const response = await fetch('/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    probability: probability,
                    num_trials: numTrials
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Ενημέρωση του γραφήματος
            Plotly.newPlot(plot, [{
                x: data.x_values,
                y: data.averages,
                mode: 'lines',
                name: 'Τρέχων μέσος όρος'
            }, {
                x: [1, Math.max(...data.x_values)],
                y: [data.theoretical, data.theoretical],
                mode: 'lines',
                line: {
                    dash: 'dash',
                    color: 'red'
                },
                name: 'Θεωρητική πιθανότητα'
            }], {
                title: 'Νόμος των Μεγάλων Αριθμών - Προσομοίωση',
                xaxis: {
                    title: 'Αριθμός δοκιμών'
                },
                yaxis: {
                    title: 'Ποσοστό επιτυχιών',
                    range: [0, 1]
                },
                hovermode: 'closest'
            });
            
            const finalAverage = data.averages[data.averages.length - 1];
            resultText.innerHTML = `<strong>Τελικό αποτέλεσμα:</strong> Μετά από ${numTrials.toLocaleString()} δοκιμές, ο μέσος όρος είναι ${finalAverage.toFixed(4)} (Θεωρητική τιμή: ${probability})`;
        }
        catch (error) {
            console.error('Σφάλμα:', error);
            resultText.textContent = 'Σφάλμα κατά την εκτέλεση της προσομοίωσης. Παρακαλώ δοκιμάστε ξανά.';
        }
        finally {
            runSimulationButton.disabled = false;
            runSimulationButton.textContent = 'Εκτέλεση Προσομοίωσης';
        }
    }
    
    // Εκτέλεση αρχικής προσομοίωσης (αφαιρέθηκε γιατί μπορεί να προκαλεί προβλήματα αν ο σέρβερ δεν είναι έτοιμος)
    // Εναλλακτικά, μπορούμε να το αντικαταστήσουμε με timeout:
    setTimeout(function() {
        runSimulation();
    }, 1000);
});
