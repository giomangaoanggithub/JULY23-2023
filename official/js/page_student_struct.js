arr_questions = [];
arr_questions_id = [];
arr_answers = [];
arr_answers_id = [];
arr_connections = [];
arr_connections_id = [];
answering_currently = "";
confirming_disconnection = "";

function start_page() {
  $.get(
    current_hosting_url + "php/js-request/page_student_start.php",
    function (data) {
      // alert(data);
      data = JSON.parse(data);
      document.getElementById("inserted-name").innerHTML = data[0]["username"];
      $.get(
        current_hosting_url + "php/js-request/page_student_start_data.php",
        function (data) {
          // alert(data);
          data = JSON.parse(data);
          if (data.length > 0) {
            document.getElementById("show-no-publish").style.display = "none";
            $("#student-table-content").empty();
            for (i = 0; i < data.length; i++) {
              arr_questions.push(data[i]["question"]);
              arr_questions_id.push(data[i]["question_id"]);
              arr_answers.push(data[i]["answers"]);
              arr_answers_id.push(data[i]["answer_id"]);
              calculated_grade = "";
              if (data[i]["grades"] == null) {
                calculated_grade = "? / " + data[i]["HPS"];
                $("#student-table-content").append(
                  "<tr><td>" +
                    data[i]["username"] +
                    "</td><td>" +
                    data[i]["question"] +
                    "</td><td>" +
                    data[i]["due_date"] +
                    "</td><td>" +
                    calculated_grade +
                    "</td><td><span class='material-icons' onclick='answer_question(" +
                    i +
                    ")'>history_edu</span></td></tr>"
                );
              } else {
                arr_grade = data[i]["grades"].split("<&,&>");
                word_count = data[i]["answers"].split(" ").length;
                calc_grammar =
                  Math.round((arr_grade[1] / word_count) * 100) / 100;
                // alert(arr_grade);
                if (Math.abs(arr_grade[2] * 100 - arr_grade[0]) > 60) {
                  arr_grade[0] = arr_grade[2] * 100;
                }
                if (arr_grade[2] * 100 > 32) {
                  calculated_grade =
                    Math.round((arr_grade[0] / 100) * data[i]["HPS"]) -
                    Math.round((arr_grade[0] / 100) * data[i]["HPS"]) *
                      calc_grammar +
                    " / " +
                    data[i]["HPS"];
                  $("#student-table-content").append(
                    "<tr><td>" +
                      data[i]["username"] +
                      "</td><td>" +
                      data[i]["question"] +
                      "</td><td>" +
                      data[i]["due_date"] +
                      "</td><td>" +
                      calculated_grade +
                      "</td><td><span onclick='view_student_answer(" +
                      data[i]["answer_id"] +
                      ")'>Answered</span></td></tr>"
                  );
                } else {
                  calculated_grade =
                    0.05 * data[i]["HPS"] + " / " + data[i]["HPS"];
                  $("#student-table-content").append(
                    "<tr><td>" +
                      data[i]["username"] +
                      "</td><td>" +
                      data[i]["question"] +
                      "</td><td>" +
                      data[i]["due_date"] +
                      "</td><td>" +
                      calculated_grade +
                      "</td><td><span onclick='view_student_answer(" +
                      data[i]["answer_id"] +
                      ")'>Answered</span></td></tr>"
                  );
                }
              }
            }
          }
        }
      );
      $.get(
        current_hosting_url + "php/js-request/page_student_start_teachers.php",
        function (data) {
          // alert(data);
          data = JSON.parse(data);
          if (data.length > 0) {
            document.getElementById("show-no-course").style.display = "none";
            for (i = 0; i < data.length; i++) {
              arr_connections.push(data[i]["username"]);
              arr_connections_id.push(data[i]["connection_id"]);
              $("#list-connected-teachers").append(
                "<tr><td>" +
                  data[i]["username"] +
                  "</td><td><span class='material-icons' onclick='disconnect_function(" +
                  data[i]["connection_id"] +
                  ")'>close</span></td></tr>"
              );
            }
          }
        }
      );
    }
  );
}

start_page();
