from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Initialize our data
current_id = 3
clients = [
    "Shake Shack", "Toast", "Computer Science Department", 
    "Teacher's College", "Starbucks", "Subsconscious", 
    "Flat Top", "Joe's Coffee", "Max Caffe", "Nussbaum & Wu", "Taco Bell"
]
sales = [
    {"id": 1, "salesperson": "James D. Halpert", "client": "Shake Shack", "reams": 100},
    {"id": 2, "salesperson": "Stanley Hudson", "client": "Toast", "reams": 400},
    {"id": 3, "salesperson": "Michael G. Scott", "client": "Computer Science Department", "reams": 1000}
]

@app.route('/')
def welcome():
    """Render the welcome page"""
    return render_template('welcome.html')

@app.route('/infinity')
def log_sales():
    """Render the sales logging page with sales and clients data"""
    return render_template('log_sales.html', sales=sales, clients=clients)

@app.route('/save_sale', methods=['POST'])
def save_sale():
    """
    Save a new sale to the server
    
    Expected request body:
    {
        "client": "Client Name",
        "reams": 123,
        "salesperson": "Salesperson Name"
    }
    """
    global current_id
    global sales
    global clients
    
    try:
        # Get the sale data from the request
        print("Received save_sale request")
        sale_data = request.get_json()
        print("Sale data received:", sale_data)
        
        # Check for required fields
        if not sale_data or 'client' not in sale_data or 'reams' not in sale_data or 'salesperson' not in sale_data:
            print("Error: Missing required fields")
            return jsonify({"error": "Missing required fields"}), 400
        
        # Add a unique ID
        current_id += 1
        sale_data['id'] = current_id
        print(f"Assigned ID {current_id} to new sale")
        
        # Add to the sales list
        sales.insert(0, sale_data)
        print("Sale added to list")
        
        # Update clients list if this is a new client
        if sale_data['client'] not in clients:
            clients.append(sale_data['client'])
            print(f"Added new client: {sale_data['client']}")
        
        # Return both sales and clients data
        return jsonify({"sales": sales, "clients": clients})
    except Exception as e:
        print(f"Error in save_sale: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/delete_sale', methods=['POST'])
def delete_sale():
    """
    Delete a sale from the server
    
    Expected request body:
    {
        "id": 123
    }
    """
    global sales
    
    try:
        # Get the sale ID from the request
        print("Received delete_sale request")
        data = request.get_json()
        print("Delete request data:", data)
        
        # Validate the request
        if not data or 'id' not in data:
            print("Error: No ID provided in delete request")
            return jsonify({"error": "No ID provided"}), 400
        
        sale_id = data['id']
        print(f"Attempting to delete sale with ID: {sale_id}, type: {type(sale_id)}")
        
        # Print current sales for debugging
        print("Current sales before deletion:", sales)
        
        # Filter out the sale with the matching ID
        original_length = len(sales)
        new_sales = []
        for sale in sales:
            # Convert to same type for comparison
            if int(sale['id']) != int(sale_id):
                new_sales.append(sale)
        
        sales = new_sales
        
        # Check if a sale was actually deleted
        if len(sales) == original_length:
            print(f"Warning: No sale with ID {sale_id} was found to delete")
        else:
            print(f"Success: Deleted sale with ID {sale_id}")
        
        # Print updated sales for debugging
        print("Sales after deletion:", sales)
        
        # Return the updated sales list
        return jsonify({"sales": sales})
    except Exception as e:
        print(f"Error in delete_sale: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Columbia Paper Infinity server...")
    print(f"Initial clients: {clients}")
    print(f"Initial sales: {sales}")
    app.run(debug=True, port=5001)