import sys
import json
import pickle
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    print(json.dumps({"error": f"Model file not found: {MODEL_PATH}"}))
    sys.exit(1)

try:
    data = json.loads(sys.stdin.read())

    features = [
        [item["rating"], item["jumlah_ulasan"], item["website"]]
        for item in data
    ]

    predictions   = model.predict(features)
    probabilities = model.predict_proba(features)

    results = [
        {
            "status":     "Prospek" if int(pred) == 1 else "Belum Prospek",
            "confidence": round(float(max(prob)), 4),
        }
        for pred, prob in zip(predictions, probabilities)
    ]

    print(json.dumps(results))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)