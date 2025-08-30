
import sys, json, os, pickle
from pathlib import Path

def load_model():
    mp = os.environ.get("MODEL_PATH") or str(Path(__file__).resolve().parents[1] / "model" / "model.pkl")
    if not os.path.exists(mp):
        return None
    with open(mp, "rb") as f:
        try:
            return pickle.load(f)
        except Exception as e:
            # if incompatible pickle, degrade
            print(json.dumps({"error": f"model_load_error: {e}"}))
            sys.exit(0)

def to_features(payload):
    # ensure numeric ordering for features expected
    keys = ["tide_height","wind_speed","sea_temp","rainfall","mangrove_index"]
    return [[float(payload.get(k, 0.0)) for k in keys]]

def mk_report(payload, score, label):
    # simple textual report
    lines = []
    lines.append(f"Region: {payload.get('region_name','-')}")
    lines.append(f"Time: {payload.get('time_stamp','-')}  Tide zone: {payload.get('tide_zone','-')}")
    for k in ["tide_height","wind_speed","sea_temp","rainfall","mangrove_index"]:
        lines.append(f"{k.replace('_',' ').title()}: {payload.get(k, 'N/A')}")
    lines.append(f"Past event: {payload.get('past_event','N/A')}")
    lines.append("")
    lines.append(f"Predicted risk score: {score:.3f}")
    lines.append(f"Model label: {label}")
    return "\n".join(lines)

def main():
    raw = sys.stdin.read()
    try:
        payload = json.loads(raw)
    except Exception:
        print(json.dumps({"error":"invalid_json"}))
        return
    model = load_model()
    X = to_features(payload)
    # baseline if model missing
    if model is None:
        s = sum(X[0]) / (len(X[0]) or 1)
        label = "baseline"
        report = mk_report(payload, s, label)
        print(json.dumps({"risk_score": s, "label": label, "report": report}))
        return
    # run model
    try:
        y = model.predict(X)
        proba = None
        if hasattr(model, "predict_proba"):
            p = model.predict_proba(X)[0]
            try:
                proba = float(max(p))
            except Exception:
                proba = None
        score = float(proba) if proba is not None else float(y[0] if hasattr(y, "__len__") else y)
        label = str(y[0]) if hasattr(y, "__len__") else str(y)
        report = mk_report(payload, score, label)
        print(json.dumps({"risk_score": score, "label": label, "report": report}))
    except Exception as e:
        print(json.dumps({"error": f"predict_error: {e}"}))

if __name__ == "__main__":
    main()
