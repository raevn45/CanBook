from database import fetch_all, fetch_one, execute_query

CANONICAL_MENU = [("Chicken Manchurian + Fried Rice", "Indo-Chinese comfort food with fluffy fried rice.", "meals", 12.00),("Veg Manchurian + Fried Rice", "Crispy veg Manchurian with fragrant fried rice.", "meals", 10.00),("Puff", "Flaky, savoury canteen classic.", "snacks", 5.00),("Chai Cake", "Soft tea-time cake for a tiny sweet break.", "desserts", 3.00),("Chole Puri", "Spiced chickpeas with warm, fluffy puri.", "meals", 10.00),("Boiled Egg", "Simple, protein-packed and ready to go.", "snacks", 2.00),("Veg Sandwich", "Fresh vegetables layered into a school-day favourite.", "sandwiches", 7.00),("Chicken Sandwich", "Tender chicken, crunchy vegetables and soft bread.", "sandwiches", 7.00),("Aalo Paratha", "Golden stuffed paratha with a hearty potato filling.", "meals", 10.00)]
LEGACY_MENU_NAMES={"cheese pizza","french fries","fresh juice","chocolate cookie"}

def sync_canonical_menu():
    for legacy_name in LEGACY_MENU_NAMES: execute_query("UPDATE menu SET available=FALSE WHERE LOWER(item_name)=%s",(legacy_name,))
    for name,description,category,price in CANONICAL_MENU:
        existing=fetch_one("SELECT item_id FROM menu WHERE LOWER(item_name)=LOWER(%s) LIMIT 1",(name,))
        if existing: execute_query("UPDATE menu SET description=%s,category=%s,price=%s,available=TRUE WHERE item_id=%s",(description,category,price,existing["item_id"]))
        else: execute_query("INSERT INTO menu (item_name,description,category,price,available) VALUES (%s,%s,%s,%s,TRUE)",(name,description,category,price))

def get_available_items(): return fetch_all("SELECT * FROM menu WHERE available=TRUE AND LOWER(item_name) NOT IN (%s,%s,%s,%s) ORDER BY category,item_name",tuple(sorted(LEGACY_MENU_NAMES)))
def get_all_items(): return fetch_all("SELECT * FROM menu WHERE LOWER(item_name) NOT IN (%s,%s,%s,%s) ORDER BY available DESC,category,item_name",tuple(sorted(LEGACY_MENU_NAMES)))
def get_item(item_id): return fetch_one("SELECT * FROM menu WHERE item_id=%s",(item_id,))
def add_item(name,description,category,price): return execute_query("INSERT INTO menu (item_name,description,category,price) VALUES (%s,%s,%s,%s)",(name,description,category,price))
def update_item(item_id,name,description,category,price):
    if not get_item(item_id): return False,"menu item not found"
    execute_query("UPDATE menu SET item_name=%s,description=%s,category=%s,price=%s WHERE item_id=%s",(name,description,category,price,item_id))
    return True,"menu item updated"
def update_item_availability(item_id,available): execute_query("UPDATE menu SET available=%s WHERE item_id=%s",(available,item_id))
def delete_item(item_id):
    item=get_item(item_id)
    if not item: return False,"menu item not found"
    usage=fetch_one("SELECT COUNT(*) AS total FROM order_items WHERE item_id=%s",(item_id,))
    if int(usage["total"] or 0)>0: return False,"This item is part of an existing order. Hide it instead to preserve order history."
    execute_query("DELETE FROM menu WHERE item_id=%s",(item_id,))
    return True,"menu item deleted"
