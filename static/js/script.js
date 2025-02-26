<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Νόμος των Μεγάλων Αριθμών</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.20.0/plotly.min.js"></script>
</head>
<body>
    <div class="container mt-5">
        <div class="row">
            <div class="col-12 text-center">
                <h1>Νόμος των Μεγάλων Αριθμών</h1>
                <p class="lead">Οπτικοποίηση της σύγκλισης του μέσου όρου προς την πραγματική πιθανότητα όσο αυξάνεται ο αριθμός των δοκιμών</p>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">Παράμετροι</div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="probability" class="form-label">Πιθανότητα επιτυχίας:</label>
                            <input type="range" class="form-range" id="probability" min="0.01" max="0.99" step="0.01" value="0.5">
                            <div class="text-center" id="probability-value">0.5</div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="num-trials" class="form-label">Αριθμός δοκιμών:</label>
                            <select class="form-select" id="num-trials">
                                <option value="100">100</option>
                                <option value="500">500</option>
                                <option value="1000" selected>1,000</option>
                                <option value="5000">5,000</option>
                                <option value="10000">10,000</option>
                                <option value="100000">100,000</option>
                            </select>
                        </div>
                        
                        <button id="run-simulation" class="btn btn-primary w-100">Εκτέλεση Προσομοίωσης</button>
                    </div>
                </div>
                
                <div class="card mt-3">
                    <div class="card-header">Επεξήγηση</div>
                    <div class="card-body">
                        <p>Ο <strong>Νόμος των Μεγάλων Αριθμών</strong> αναφέρει ότι καθώς ο αριθμός των δοκιμών αυξάνεται, ο μέσος όρος των αποτελεσμάτων τείνει προς την αναμενόμενη τιμή (πραγματική πιθανότητα).</p>
                        <p>Στο γράφημα, η μπλε γραμμή δείχνει τον τρέχοντα μέσο όρο μετά από κάθε δοκιμή, ενώ η κόκκινη διακεκομμένη γραμμή δείχνει την πραγματική πιθανότητα.</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Αποτελέσματα</div>
                    <div class="card-body">
                        <div id="simulation-plot" style="width: 100%; height: 400px;"></div>
                        <div class="text-center mt-3" id="result-text"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-12 text-center text-muted">
                <p>Δημιουργήθηκε με Flask και Plotly.js</p>
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="{{ url_for('static', filename='js/script.js') }}"></script>
</body>
</html>
