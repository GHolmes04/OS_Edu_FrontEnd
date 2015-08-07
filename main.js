//jQuery.ajax
$(function(){
  'use strict';
  var sa = 'http://localhost:3000';
  //var sa = 'https://young-citadel-2431.herokuapp.com';
  // var sa = 'http://10.13.108.54:3000';
  var token;
  var user;
  // $(document).ready(function({$("#teacher-info").hide()});
  // var showInfo = $("#teacher-info").show();


  $("#register").on('click', function(e) {
    $.ajax(sa + '/users', {
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({
        credentials: {
          email: $('#email').val(),
          password: $('#password').val(),
          password_confirmation: $('#password').val()
        }
      }),
      dataType: 'json',
      method: 'POST'
    }).done(function(data, textStatus, jqxhr) {

      $('#result').val(JSON.stringify(data));


      console.log('Hey! You did it! Congrats! Now go do another');
    }).fail(function(jqxhr, textStatus, errorThrown) {
      $('#result').val('registration failed');
    });
  });



  $("#login").on('click', function(e){
    $.ajax(sa + "/login", {
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({
        credentials: {
          email: $('#email').val(),
          password: $('#password').val()
        }
      }),
      dataType: 'json',
      method: 'POST'
    }).done(function(data){
      $("#token").val(data.token);
      console.log('Login successful');
      console.log(data);
      token = data.token;
      $("#user-id").val(data.id);
      retrieveSchools();
      retrieveSubjects();
    }).fail(function(){
      $('#result').val('login failed');
    });
  });

  $("#delete-user").on('click', function(){
    $.ajax(sa + '/users/' + $("#user-id").val(),
    {
      contentType: 'application/json',
      dataType: 'json',
      method: 'DELETE',
     headers: {Authorization: "Token token=" + token}
   }).done(function(data){
     console.log("Deleted user from database. You did it, you did it,you did it, horray");
   }).fail(function(jqxhr, textStatus, errorThrown){
     console.error(jqxhr);
   });
  });

//ajax for teachers
//CREATE teacher
   $("#teacher-create").on('click', function(e) {
      console.log(token);
      $.ajax(sa + '/teachers', {
        contentType: 'application/json',
        data: JSON.stringify({
          teacher: {
            username: $('#teacher-username').val(),
            school_id: $('#school_id').val(),
            lesson_plan_id: $('#lesson_plan_id').val()
          }
        }),
        dataType: 'json',
        method: 'POST',
        headers: {
         Authorization: 'Token token=' + token
       }
      }).done(function(data, textStatus, jqxhr) {
        $('#result').val(JSON.stringify(data));
        $('#result')
        $("#teacher-id").val(data.id);
        $("#teacher-user-id").val(data.user_id)

          console.log('Hey! You did it! Congrats! Now go do another');
      }).fail(function(jqxhr, textStatus, errorThrown) {
        $('#result').val('registration failed');
           console.log(textStatus);
      });
    });

//update teachers with Ajax
  $("#teacher-update").on('click', function(){
   $.ajax({
     url: sa +'/teachers/' + $("#teacher-id").val(),
     type: 'PATCH',
     data: {
      teacher: {
        username: $('#teacher-username').val(),
        school: $('#teacher-school-id').val(),
        lesson_plan_id: $('#teacher-lesson-plan-id').val(),
        user_id: $('teaher-user-id').val()
        }
      }
    }).done(function(data) {
     console.log("success");
     console.log(data);
   })
   .fail(function(jqxhr, textStatus, errorThrown) {
     console.log("error");
     console.log(textStatus);
   })
   .always(function() {
     console.log("complete");
   })
  });




//   // List users. Unessecary code. keep to use as template for other list actions


  // $("#list").on('click', function(e){
  //   $.ajax(sa + '/users', {
  //     dataType: 'json',
  //     method: 'GET',
  //     headers: {
  //       Authorization: 'Token token=' + $('#token').val()
  //     }
  //   }).done(function(data){
  //     $("#result").val(JSON.stringify(data));
  //       console.log('Hey! You did it! Congrats! Now go do another');
  //   }).fail(function(){
  //     $("#result").val('list failed');
  //   });
  // });
  $("#school-create").on("click", function(e) {
         $.ajax(sa + "/schools", {
             contentType: "application/json",
             processData: false,
             data: JSON.stringify({
               school: {
                 name: $("#school-name").val(),
                 grade_level: $("#grade-level").val()
               }
             }),
             dataType: "json",
             method: "POST",
             headers: {
               Authorization: 'Token token=' + token
             }
         })
         .done(function(data, textStatus, jqXHR) {
             $("#result").val(JSON.stringify(data));
             console.log(JSON.stringify(data));
         })
         .fail(function(jqXHR, textStatus, errorThrown) {
             //$("#result").val("create failed");
             console.log('Failed to create school.')
         })
         .always();

  });

  function retrieveSchools(){
    $.ajax(sa + '/schools', {
      dataType: 'json',
      method: 'GET',
      headers: {
        Authorization: 'Token token=' + $('#token').val()
      }
    }).done(function(data){
      console.log(data);
      data.schools.forEach(function(currVal) {
        currVal.href = sa +'/schools/' + currVal.id;
      });
      $("#result").val(JSON.stringify(data));
      console.log('Hey! You did it! Congrats! Now go do another');

      var schoolsListHtml = View.Templates.list(data);
      $("#schools-list").html(schoolsListHtml)
    }).fail(function(){
      $("#result").val('list failed');
    });
  };
  function retrieveSubjects(){
    $.ajax(sa + '/subjects', {
      dataType: 'json',
      method: 'GET',
      headers: {
        Authorization: 'Token token=' + $('#token').val()
      }
    }).done(function(data){
      console.log(data);
      data.subjects.forEach(function(currVal) {
        currVal.href = sa +'/subjects/' + currVal.id;
      });
      $("#result").val(JSON.stringify(data));
      console.log('Hey! You did it! Congrats! Now go do another');

      var subjectListHtml = View.Templates.list(data);
      $("#subjects-list").html(subjectsListHtml)
    }).fail(function(){
      $("#result").val('list failed');
    });
  };

});
