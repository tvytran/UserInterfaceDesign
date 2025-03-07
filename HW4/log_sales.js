$(document).ready(function () {
    const salesperson = "User123";

    let clients = [
        "Shake Shack", "Toast", "Computer Science Department", 
        "Teacher's College", "Starbucks", "Subsconscious", 
        "Flat Top", "Joe's Coffee", "Max Caffe", "Nussbaum & Wu", "Taco Bell"
    ];

    let sales = [
        { "salesperson": "James D. Halpert", "client": "Shake Shack", "reams": 100 },
        { "salesperson": "Stanley Hudson", "client": "Toast", "reams": 400 },
        { "salesperson": "Michael G. Scott", "client": "Computer Science Department", "reams": 1000 }
    ];

    $("#client").autocomplete({ source: clients });

    function renderSales() {
        $("#sales-list").html("");

        sales.forEach((sale, index) => {
            let saleRow = $(`
                <div class="sale-item border p-2 d-flex justify-content-between align-items-center mb-2" data-index="${index}">
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
            start: function () {
                $(this).css("background", "lightyellow");
                console.log("Dragging started");
            },
            stop: function () {
                $(this).css("background", "white");
            }
        });
    }

    function addSale() {
        let client = $("#client").val().trim();
        let reams = $("#reams").val().trim();

        let valid = true;
        $("#client-error, #reams-error").text("");

        if (!client) {
            $("#client-error").text("Client name required.");
            valid = false;
			$("#client").focus();
        }

        if (!reams || isNaN(reams)) {
            $("#reams-error").text("Reams must be a number.");
			if (valid) $("#reams").focus();
            valid = false;
        }

        if (!valid) return;

        if (!clients.includes(client)) {
            clients.push(client);
            $("#client").autocomplete("option", "source", clients);
        }

        sales.unshift({ client: client, reams: Number(reams), salesperson: salesperson });

        renderSales();

        $("#client, #reams").val("");
        $("#client").focus();
    }

    // Handle Submit Button
    $("#submit").click(addSale);

    // Handle Enter Key
    $("#reams").keypress(function (event) {
        if (event.which === 13) {
            addSale();
        }
    });

    // Handle Delete Button
    $(document).on("click", ".delete-sale", function () {
        let index = $(this).closest(".sale-item").data("index");
        sales.splice(index, 1);
        renderSales();
    });


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
			let index = $(ui.draggable).data("index");
			sales.splice(index, 1);
			renderSales();
			$(this).removeClass("hovered").addClass("dropped"); // Keep a different color after dropping
        console.log("Item dropped in the trash bin");
    }
}); 
			

	
    // Implement Drag & Drop for Deletion
    $("#trash").droppable({
		accept: ".sale-item",
		over: function () {
			$(this).css("background-color", "yellow"); // Manually change background
			console.log("Item is over the trash bin");
		},
		out: function () {
			$(this).css("background-color", "red"); // Reset when leaving
			console.log("Item left the trash bin");
		},
		drop: function (event, ui) {
			let index = $(ui.draggable).data("index");
			sales.splice(index, 1);
			renderSales();
			$(this).css("background-color", "red"); // Reset color after deletion
			console.log("Item was dropped and deleted");
		}
	});
	
	$("#trash").hover(
		function () {
			$(this).css("background-color", "yellow"); 
		},
		function () {
			$(this).css("background-color", "");
		}
	);

    // Initial Render
    renderSales();
});
