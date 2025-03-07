$(document).ready(function () {
    // Define the salesperson here to ensure it's available
    const salesperson = "User123";

    // Function to display sales list
    function display_sales_list(sales_data) {
        $("#sales-list").html("");

        sales_data.forEach((sale, index) => {
            
            let saleRow = $(`
                <div class="sale-item border p-2 d-flex justify-content-between align-items-center mb-2" data-index="${index}" data-id="${sale.id}">
                    <span><strong>${sale.client}</strong> - ${sale.reams} reams (Sold by: ${sale.salesperson})</span>
                    <button class="btn btn-danger btn-sm delete-sale">Delete</button>
                </div>
            `);

            $("#sales-list").append(saleRow);
        });

        // Make sales draggable
        $(".sale-item").draggable({
            revert: "invalid",
            cursor: "move",
            helper: "clone",
            start: function () {
                $(this).css("background", "lightyellow");
                console.log("Dragging started for item with ID:", $(this).data("id"));
            },
            stop: function () {
                $(this).css("background", "white");
            }
        });
        
        // Verify that each item has the correct data-id attribute
        $(".sale-item").each(function() {
            console.log("Sale item ID:", $(this).data("id"));
        });
        
        console.log("Sales list displayed and items made draggable");
    }

    // Function to save a sale
    function save_sale(new_sale) {
        console.log("Attempting to save sale:", new_sale);
        
        $.ajax({
            type: "POST",
            url: "/save_sale",
            data: JSON.stringify(new_sale),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log("Sale saved successfully:", response);
                // Update the sales list
                display_sales_list(response.sales);
                // Update autocomplete
                $("#client").autocomplete("option", "source", response.clients);
            },
            error: function(error) {
                console.error("Error saving sale:", error);
                console.error("Status:", error.status);
                console.error("Status text:", error.statusText);
                console.error("Response text:", error.responseText);
                alert("Error saving sale. Check the console for details.");
            }
        });
    }

    // Function to delete a sale
    function delete_sale(id) {
        console.log("Attempting to delete sale with ID:", id);
        
        $.ajax({
            type: "POST",
            url: "/delete_sale",
            data: JSON.stringify({id: id}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log("Sale deleted successfully:", response);
                // Update the sales list
                display_sales_list(response.sales);
            },
            error: function(error) {
                console.error("Error deleting sale:", error);
                console.error("Status:", error.status);
                console.error("Status text:", error.statusText);
                console.error("Response text:", error.responseText);
                alert("Error deleting sale. Check the console for details.");
            }
        });
    }

    // Initialize autocomplete
    console.log("Initializing autocomplete with clients:", clients);
    $("#client").autocomplete({ source: clients });

    // Function to validate and add a sale
    function addSale() {
        let client = $("#client").val().trim();
        let reams = $("#reams").val().trim();

        console.log("Adding sale - Client:", client, "Reams:", reams);

        let valid = true;
        $("#client-error, #reams-error").text("");

        if (!client) {
            $("#client-error").text("Client name required.");
            valid = false;
            $("#client").focus();
            console.log("Validation failed: Client name required");
        }

        if (!reams || isNaN(reams)) {
            $("#reams-error").text("Reams must be a number.");
            if (valid) $("#reams").focus();
            valid = false;
            console.log("Validation failed: Reams must be a number");
        }

        if (!valid) {
            console.log("Form validation failed");
            return;
        }

        console.log("Form validation passed, creating sale object");

        // Create the sale object
        const newSale = {
            client: client,
            reams: Number(reams),
            salesperson: salesperson
        };

        console.log("Sale object created:", newSale);

        // Save the sale to the server
        save_sale(newSale);

        // Clear the form
        $("#client, #reams").val("");
        $("#client").focus();
    }

    // Handle Submit Button
    console.log("Setting up submit button handler");
    $("#submit").click(function(e) {
        e.preventDefault();
        console.log("Submit button clicked");
        addSale();
    });

    // Handle Enter Key
    console.log("Setting up enter key handler");
    $("#reams").keypress(function (event) {
        if (event.which === 13) {
            event.preventDefault();
            console.log("Enter key pressed in reams field");
            addSale();
        }
    });

    // Handle Delete Button
    console.log("Setting up delete button handler");
    $(document).on("click", ".delete-sale", function () {
        let saleItem = $(this).closest(".sale-item");
        let id = parseInt(saleItem.data("id"));
        console.log("Delete button clicked for sale item:", saleItem);
        console.log("Delete button clicked for ID:", id);
        delete_sale(id);
    });

    // Implement Drag & Drop for Deletion
    console.log("Setting up trash droppable");
    $("#trash").droppable({
        accept: ".sale-item",
        over: function () {
            $(this).addClass("hovered");
            console.log("Item is over the trash bin");
        },
        out: function () {
            $(this).removeClass("hovered");
            console.log("Item left the trash bin");
        },
        drop: function (event, ui) {
            let id = parseInt($(ui.draggable).data("id"));
            console.log("Item dropped in trash bin, draggable:", ui.draggable);
            console.log("Item dropped in trash bin, ID:", id);
            delete_sale(id);
            $(this).removeClass("hovered").addClass("dropped");
            setTimeout(() => {
                $(this).removeClass("dropped");
            }, 500);
        }
    });

    // Initial Render
    console.log("Performing initial render of sales list");
    display_sales_list(sales);
    
    console.log("Initialization complete");
});