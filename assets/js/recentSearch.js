var pushToDB = function(obj) {
  database.ref().push(obj);
};

var retrieveTopFive = function() {
  database
    .ref()
    // .orderByChild('place')
    .orderByKey()
    .limitToLast(5)
    .on('child_added', snapshot => {
      let destination = snapshot.val();
      //   console.log(snapshot.key);
      console.log(destination.place);
      if (destination.place) {
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
          // $('#inputDestination').val();
          console.log(snapshot.val());
          console.log(e.target.textContent);
          $('#inputDestination').val() = e.target.textContent
        });
      }
    });
};

$(function() {
  retrieveTopFive();
});
