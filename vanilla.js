 
(function() {
    var contentElement = $('#user-table');
	var accountsList = [];

    function createAccount(user) {
        return $('<div>').attr('id', user.id).append(createAvatar(user)).append(createLogin(user));
    }

    function createAvatar(user) {
        return $('<img/>').addClass('img-circle').attr('src', user.avatar_url).attr('data-toggle', 'collapse');
    }

    function createLogin(user) {
        return $('<p/>').addClass('font-login').append(user.login + (user.site_admin ? ' (admin)' : ' (user)'));
    }

    function constructDetails(sellectedAccount, selectedUserId){
        $('#'+ selectedUserId).append('<div id = "details-' + selectedUserId + '"/>');
        $('#details-'+ selectedUserId).addClass('panel-collapse collapse in');
        $.each(sellectedAccount.followersList, function(i, follower){
            $('<a/>').attr('href', follower.url).text(follower.login).addClass('element').appendTo("#details-" + selectedUserId);
        });   
    }

    function createTable(list) {
        $.each(list, function(i, user){            
            $('<div></div>').append(createAccount(user)).appendTo('#user-table');
        });        

        var tableBody = $('#user-table').click(event, function (){
            var selectedUserId = event.target.parentElement.id;
            if (selectedUserId){
                let selectedUser = accountsList.find(function(account) {return account.id == selectedUserId });
                if (selectedUser) {
                    if (selectedUser.followersList) {
                        if (selectedUserId && selectedUserId != 'user-table'){
                            $('#details-'+ selectedUserId + '.collapse').collapse('toggle')
                        };       
                    } else {
                        fetchUserDetails(selectedUser.followers_url, selectedUserId, constructDetails);
                    };
                };
            };            
        });
    }

    function fetchUserDetails(followersUrl, selectedUserId, callback){
        return $.ajax(followersUrl).then(response => {
                let sellectedAccount = accountsList.find(function(account){ return account.id == selectedUserId})
                followersData = response;
                sellectedAccount.followersList = followersData.map(function(follower){
                    return {
                        login: follower.login,
                        url: follower.html_url
                    };
                });
                callback(sellectedAccount, selectedUserId);       
        });
    }

    function init () {
        var url = "https://api.github.com/users";

        return $.ajax(url).then(response => {
            accountsList = response;
            createTable(accountsList);
            return accountsList;
        })
    };

    init();
})();

