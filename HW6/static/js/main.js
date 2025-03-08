$(document).ready(function() {
    // Handle search form submission
    $('#search-form').on('submit', function(e) {
        const searchInput = $('#search-input');
        const query = searchInput.val().trim();
        
        // If the query is only whitespace, prevent form submission
        if (!query) {
            e.preventDefault();
            searchInput.val(''); // Clear the input
            searchInput.focus(); // Keep focus on the search input
        }
    });

    // Clear search results on new search
    $('#search-input').on('focus', function() {
        $(this).val(''); // Clear input when focused
    });
});