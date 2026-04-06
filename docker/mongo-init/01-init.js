db = db.getSiblingDB("InersiaDB");

db.createUser({
  user: "appinersia",
  pwd: "inersia123",
  roles: [{ role: "readWrite", db: "InersiaDB" }],
});

print("appinersia created for InersiaDB");