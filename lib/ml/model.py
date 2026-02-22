import pickle
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score

df = pd.read_csv("rawdata.csv")
df = df.dropna(subset=["NoTelp"])

df = df[["Rating", "Jumlah Ulasan", "Website", "Status"]].copy()
df["Rating"]        = pd.to_numeric(df["Rating"], errors="coerce")
df["Jumlah Ulasan"] = pd.to_numeric(df["Jumlah Ulasan"], errors="coerce")
df = df.dropna(subset=["Rating", "Jumlah Ulasan"])

df["Website"] = df["Website"].fillna("").apply(lambda x: 1 if x != "" else 0)
df["Status"]  = df["Status"].apply(lambda x: 0 if x == "Cold Prospek" else 1)

X = df[["Rating", "Jumlah Ulasan", "Website"]]
y = df["Status"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Total  : {len(df)} | Train: {len(X_train)} | Test: {len(X_test)}")

model = RandomForestClassifier(n_estimators=100, max_features="sqrt", random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"Accuracy : {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall   : {recall_score(y_test, y_pred):.4f}")

importance = pd.DataFrame({
    "Feature":    X.columns,
    "Importance": model.feature_importances_,
}).sort_values("Importance", ascending=False)
print(f"\n{importance.to_string(index=False)}")

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("\nModel saved to: model.pkl")