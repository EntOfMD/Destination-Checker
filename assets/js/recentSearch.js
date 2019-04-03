var loc;

var pushToDB = function(obj) {
    database.ref().push(obj);
};

var reloadContent = function(location) {
    fx.getMap(location);
};

var retrieveTopFive = function() {
    database
        .ref()
        // .orderByChild('place')
        .orderByKey()
        .limitToLast(5)
        .on('child_added', snapshot => {
            let destination = snapshot.val();

            $('#recentBtnGrp').prepend(
                `
              <button id="${
                  snapshot.key
              }"  class="btn btn-secondary rounded m-1 searchTerm">${
                    destination.place
                }</button>
              `
            );
            $(`#${snapshot.key}`).on('click', e => {
                loc = e.target.textContent;

                reloadContent(e.target.textContent);
            });
        });
};

$(function() {
    retrieveTopFive();
});
