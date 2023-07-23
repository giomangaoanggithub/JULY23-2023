// this javascript program runs all the necessary operations needed on live during the use of the page_teacher.php
// operations like button clicks to request certain data or even a mouse hover to make it responsive

// this button click logs out the user
$("#logout-btn").click(function () {
  $.get(
    current_hosting_url + "php/js-request/current_session_destroy.php",
    function () {
      window.location = current_hosting_url + "pages/page_register_login.php";
    }
  );
});

// this button click publishes a question to the students to answer
$("#post-question").click(function () {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("show-loading").style.display = "block";
  $.post(
    current_hosting_url + "php/ml_all_steps.php",
    {
      question: document.getElementById("post-question-content").value,
      hps: document.getElementById("choose-grade").value,
      due: document.getElementById("due-input").value,
    },
    function (response) {
      $.get(
        current_hosting_url + "php/js-request/page_teacher_start_data.php",
        function (data) {
          data = JSON.parse(data);
          if (data.length > 0) {
            document.getElementById("if-empty-table-question").style.display =
              "none";
            $("#teacher-left-side-table-tr").empty();
            for (i = 0; i < data.length; i++) {
              arr_questions.push(data[i]["question"]);
              arr_collected_links.push(data[i]["collected_links"]);
              arr_time_of_issue.push(data[i]["time_of_issue"]);
              arr_grades.push(data[i]["HPS"]);
              $("#teacher-left-side-table-tr").append(
                "<tr><td>" +
                  data[i]["question"] +
                  "</td><td>" +
                  data[i]["HPS"] +
                  "</td><td>" +
                  data[i]["due_date"] +
                  "</td><td><span class='material-icons'>edit</span><span class='material-icons'>delete</span></td></tr>"
              );
            }
          }
          document.getElementById("overlay").style.display = "none";
          document.getElementById("show-loading").style.display = "none";
          alert(response);
        }
      );
    }
  );
});

// this button click unblurs or blurs the course code
$("#account-course-code-show").click(function () {
  if (
    document.getElementById("account-course-code-show").innerHTML ==
    "visibility_off"
  ) {
    document.getElementById("account-course-code").style.color = "black";
    document.getElementById("account-course-code").style.textShadow = "none";
    document.getElementById("account-course-code-show").innerHTML =
      "visibility";
  } else {
    document.getElementById("account-course-code").style.color = "transparent";
    document.getElementById("account-course-code").style.textShadow =
      "0 0 8px #000";
    document.getElementById("account-course-code-show").innerHTML =
      "visibility_off";
  }
});

//this button shows the prompt to change the account's username
$("#edit-username").click(function () {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("green-prompt").style.display = "block";
  document.getElementById("insert-title").innerHTML = "Changing Username";
  document.getElementById("green-prompt-content").innerHTML =
    "<h2>Username:</h2><input id='new-username-input' value='" +
    document.getElementById("inserted-name").innerHTML +
    "'><br><br><button onclick='cancel_btn_function()'>CANCEL</button><button onclick='apply_change_username()'>APPLY</button>";
});

// this button click closes the overlay and the prompt form
function cancel_btn_function() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("green-prompt").style.display = "none";
}

// this button confirms the change of the account's username
function apply_change_username() {
  if (
    document.getElementById("inserted-name").innerHTML ==
    document.getElementById("new-username-input").value
  ) {
    alert("You still have the same Username");
  } else {
    $.post(
      current_hosting_url + "php/js-request/change_username.php",
      {
        username: document.getElementById("new-username-input").value,
        role: 1,
      },
      function (data) {
        alert(data);
        document.getElementById("inserted-name").innerHTML =
          document.getElementById("new-username-input").value;
        cancel_btn_function();
      }
    );
  }
}

function click_tr_question(num) {
  $.post(
    current_hosting_url + "php/js-request/page_teacher_fetch_question_data.php",
    { question_id: num },
    function (data) {
      // alert(data);
      data = JSON.parse(data);
      document.getElementById("show-current-question").style.display = "none";
      $("#teacher-right-side-table-tr").empty();
      if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
          arr_grade = data[i]["grades"].split("<&,&>");
          word_count = data[i]["answers"].split(" ").length;
          calc_grammar = Math.round((arr_grade[1] / word_count) * 100) / 100;
          if (arr_grade[2] * 100 >= 40) {
            calculated_grade =
              Math.round((arr_grade[0] / 100) * data[i]["HPS"]) -
              Math.round((arr_grade[0] / 100) * data[i]["HPS"]) * calc_grammar +
              " / " +
              data[i]["HPS"];
            $("#teacher-right-side-table-tr").append(
              "<tr><td>" +
                data[i]["time_of_submission"] +
                "<br><br>" +
                data[i]["answers"] +
                "</td><td>" +
                calculated_grade +
                "</td><td>" +
                data[i]["username"] +
                '</td><td><span class="material-icons">edit</span></td></tr>'
            );
          } else {
            calculated_grade = 0.05 * data[i]["HPS"];
            $("#teacher-right-side-table-tr").append(
              "<tr><td>" +
                data[i]["time_of_submission"] +
                "<br><br>" +
                data[i]["answers"] +
                "</td><td>" +
                calculated_grade +
                "</td><td>" +
                data[i]["username"] +
                '</td><td><span class="material-icons">edit</span></td></tr>'
            );
          }
        }
      } else {
        document.getElementById("show-current-question").style.display =
          "table-cell";
      }
    }
  );
}

function disconnect_function(input) {
  confirming_disconnection = input;
  chosen_connection =
    arr_connections[arr_connections_id.indexOf(input.toString())];
  student = arr_connections[arr_connections_id.indexOf(input.toString())];
  document.getElementById("overlay").style.display = "block";
  document.getElementById("green-prompt").style.display = "block";
  document.getElementById("insert-title").innerHTML = "Disconnect?";
  document.getElementById("green-prompt-content").style.height = "5vh";
  document.getElementById("green-prompt-content").innerHTML =
    "Do you want to disconnect Teacher <strong>" +
    student +
    "</strong>?<br>You can reconnect via course code, if it is a mistake later on.<br><button onclick='cancel_btn_function()'>CANCEL</button><button onclick='confirm_disconnection()'>YES</button>";
}

function confirm_disconnection() {
  $.post(
    current_hosting_url + "php/js-request/user_disconnect.php",
    {
      connection_id: confirming_disconnection,
      connection_name: chosen_connection,
    },
    function (data) {
      alert(data);
      window.location = current_hosting_url + "pages/page_teacher.php";
    }
  );
}

function show_edit_question_prompt(input_id) {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("green-prompt").style.display = "block";
  document.getElementById("insert-title").innerHTML = "Edit Mode (coming soon)";
  question = arr_questions[arr_questions_id.indexOf(input_id.toString())];
  links =
    arr_collected_links[arr_questions_id.indexOf(input_id.toString())].split(
      "<&,&>"
    );
  links_spanners = "";
  for (i = 0; i < links.length; i++) {
    links_spanners +=
      "<span class='highlightable-sources'><span class='delete-source material-icons'>delete</span>• " +
      links[i] +
      "</span><br>";
  }
  links_spanners =
    "<div id='linkspanner_scrollable'>" + links_spanners + "</div>";
  document.getElementById("green-prompt-content").innerHTML =
    "<span>" +
    question +
    "</span><br><br><input type='text' id='rewrite-question' placeholder='Rewrite question here...'><br><br>Sources:<div style='width: 100%; border: 2px solid #379683'></div><br>" +
    links_spanners +
    "<br><br><div style='width: 100%; border: 2px solid #379683'></div><button onclick='cancel_btn_function()'>CANCEL</button>";
}

function open_machine_knowledge() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("green-prompt").style.display = "block";
  document.getElementById("insert-title").innerHTML = "Your References";
  output = "";
  for (i = 0; i < arr_teacher_filenames.length; i++) {
    output +=
      `<span class='delete-source material-icons' onclick='delete_file("` +
      current_user +
      `","` +
      arr_teacher_filenames[i] +
      `", ` +
      i +
      `)'>delete</span><span class='highlightable-sources' onclick='open_file("` +
      current_user +
      `","` +
      arr_teacher_filenames[i] +
      `")'>• ` +
      arr_teacher_filenames[i] +
      "</span><br>";
  }
  $.get(
    current_hosting_url + "php/js-request/display_machine_knowledge.php",
    function (data) {
      // decode data
      original_words = "<&original_words&>";
      stemming_words = "<&stemming_words&>";
      phrases = "<&phrases&>";
      tfidf = "<&tfidf&>";
      original_words_num = data.indexOf(original_words) + original_words.length;
      stemming_words_num = data.indexOf(stemming_words) + stemming_words.length;
      phrases_num = data.indexOf(phrases) + phrases.length;
      tfidf_num = data.indexOf(tfidf) + tfidf.length;
      data1 = "";
      data2 = "";
      data3 = "";
      data4 = "";
      for (i = original_words_num; i < data.indexOf(stemming_words); i++) {
        data1 += data[i];
      }
      for (i = stemming_words_num; i < data.indexOf(phrases); i++) {
        data2 += data[i];
      }
      for (i = phrases_num; i < data.indexOf(tfidf); i++) {
        data3 += data[i];
      }
      for (i = tfidf_num; i < data.length; i++) {
        data4 += data[i];
      }
      data1 = data1.split("<,>");
      data2 = data2.split("<,>");
      data3 = data3.split("<,>");
      data4 = data4.split("<,>");

      xValues = [];
      getx_maxcoordinates = data4[0].split(",");
      max_coord_output = 0;
      string_coordinates = "";
      for (i = 0; i < getx_maxcoordinates.length; i++) {
        if (getx_maxcoordinates[i].includes("0_")) {
          converter = getx_maxcoordinates[i].replace("0_", "");
          for (h = 0; h < converter; h++) {
            string_coordinates += "0,";
          }
        } else {
          string_coordinates += getx_maxcoordinates[i] + ",";
        }
      }
      max_coord_output = string_coordinates.slice(0, -1).split(",").length;
      for (i = 0; i < 15; i++) {
        xValues.push(Math.round((max_coord_output / 15) * (i + 1)));
      }
      // alert(xValues);
      // alert("data4: " + data4.length); // 4296
      phrase_limited_coords = [];
      for (i = 0; i < 15; i++) {
        phrase_limited_coords.push(Math.round((data4.length / 15) * (i + 1)));
      }
      // alert("phrase_limited_coords: " + phrase_limited_coords);
      arr_phrase_middle = [Math.round(phrase_limited_coords[0] / 2)];
      data_phrases = [];
      for (i = 1; i < phrase_limited_coords.length; i++) {
        arr_phrase_middle.push(phrase_limited_coords[i] - arr_phrase_middle[0]);
      }
      // alert(arr_phrase_middle);
      for (i = 0; i < arr_phrase_middle.length; i++) {
        data_phrases.push(data3[arr_phrase_middle[i]]);
      }
      for (i = 0; i < data_phrases.length; i++) {
        hold_phrase = data_phrases[i];
        for (h = 0; h < data2.length; h++) {
          if (hold_phrase.includes(data2[h])) {
            hold_phrase = hold_phrase.replace(data2[h], data1[h]);
          }
        }
        data_phrases[i] = "label: '" + hold_phrase + "',";
      }
      // alert("data_phrases: " + data_phrases);

      raw_graph_data = [];
      for (i = 0; i < phrase_limited_coords.length; i++) {
        tfidf_reader = "";
        raw_data = data4[phrase_limited_coords[i] - 1].split(",");

        // alert(raw_data);
        for (h = 0; h < raw_data.length; h++) {
          if (raw_data[h].includes("0_")) {
            converter = raw_data[h].replace("0_", "");
            for (g = 0; g < converter; g++) {
              tfidf_reader += "0,";
            }
          } else {
            tfidf_reader += raw_data[h] + ",";
          }
        }
        tfidf_reader = tfidf_reader.slice(0, -1);
        raw_graph_data.push(tfidf_reader);
      }
      // alert("count: " + raw_graph_data.length + " | " + raw_graph_data);
      // alert(phrase_limited_coords);
      // alert(raw_graph_data[0].slice(",").length);

      raw_graph_data_lim = raw_graph_data[0].split(",").length;
      graph_summaries = [];

      for (i = 0; i < 15; i++) {
        graph_summaries.push(Math.round((raw_graph_data_lim / 15) * (i + 1)));
      }
      // alert("graph_summaries: " + graph_summaries);
      // alert("raw_graph_data: " + raw_graph_data.length);

      graph_data = [];

      for (i = 0; i < raw_graph_data.length; i++) {
        curr_graph_data = raw_graph_data[i].split(",");
        curr_graph_coord = [];
        curr_graph_num = 0;
        curr_summary = 0;
        for (h = 0; h < curr_graph_data.length; h++) {
          curr_graph_num += parseFloat(curr_graph_data[h]);
          if (h > graph_summaries[curr_summary] - 1) {
            // alert(h);
            curr_graph_coord.push(curr_graph_num);
            curr_summary += 1;
            curr_graph_num = 0;
          } else if (h + 1 == curr_graph_data.length) {
            // alert("final: " + curr_graph_num);
            curr_graph_coord.push(curr_graph_num);
          }
        }
        string_coordinates = "[";
        for (h = 0; h < curr_graph_coord.length; h++) {
          string_coordinates += curr_graph_coord[h] + ",";
        }
        string_coordinates = string_coordinates.slice(0, -1);
        string_coordinates += "],";
        graph_data.push(string_coordinates);
      }

      // alert(graph_data[graph_data.length - 1]);
      graph_coloration = [];
      definition_coloration = [];
      for (i = 0; i < graph_data.length; i++) {
        percentage_color = ((i + 1) / graph_data.length) * 100;
        curr_rgb = "";
        def_rgb = "";
        if (percentage_color < 34) {
          curr_rgb =
            "borderColor: 'rgb(" +
            Math.round((percentage_color / 100) * 255) +
            ",0,0)',";
          def_rgb =
            "rgb(" + Math.round((percentage_color / 100) * 255) + ",0,0)";
        } else if (percentage_color < 67) {
          curr_rgb =
            "borderColor: 'rgb(255," +
            Math.round((percentage_color / 100) * 255) +
            ",0)',";
          def_rgb =
            "rgb(255," + Math.round((percentage_color / 100) * 255) + ",0)";
        } else {
          curr_rgb =
            "borderColor: 'rgb(0,200," +
            Math.round((percentage_color / 100) * 255) +
            ")',";
          def_rgb =
            "rgb(0,200," + Math.round((percentage_color / 100) * 255) + ")";
        }
        graph_coloration.push(curr_rgb);
        definition_coloration.push(def_rgb);
      }

      stringify_data_phrases = "";
      for (i = 0; i < data_phrases.length; i++) {
        hold_phrase = data_phrases[i].replace(
          "label: '",
          "<span style=' color: " + definition_coloration[i] + "'>"
        );
        stringify_data_phrases +=
          "context_" +
          (i + 1) +
          ": " +
          hold_phrase.replace("',", "</span><br>");
      }
      document.getElementById("stringify_data_phrases").innerHTML =
        stringify_data_phrases;

      for (i = 0; i < graph_data.length; i++) {
        graph_data[i] =
          "{data: " +
          graph_data[i] +
          graph_coloration[i] +
          "fill: false, " +
          "label: 'context_" +
          (i + 1) +
          // data_phrases[i] +
          "',},";
      }

      // alert("graph_coloration: " + graph_coloration);

      graph_output = "";

      for (i = 0; i < graph_data.length; i++) {
        graph_output += graph_data[i];
      }

      graph_code =
        `new Chart("myChart", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [
            ` +
        graph_output +
        `
          ],
        },
        options: {
          legend: { display: true, position: 'right'},
        },
      });`;
      // alert(graph_code);
      eval(graph_code);
    }
  );
  output = "<div id='referencespanner_scrollable'>" + output + "</div>";
  document.getElementById("green-prompt-content").innerHTML =
    `<span>This is where you put all your <strong>references</strong> for the machine to <strong>read 
  and learn</strong>, in order for the machine to <strong>check essays</strong> for you. More references, the better.
  </span><br>Keep in mind, make sure your questions can be <strong>found</strong> from one of your references.<br><br>
  Upload your reference here: <input type="file" name="fileToUpload" id="fileToUpload"><button id="upload-file" onclick='upload_file_function()'>UPLOAD</button><br><br>
  Sources:<div style='width: 100%; border: 2px solid #379683'></div>` +
    output +
    `<div style='width: 100%; border: 2px solid #379683'></div><br>` +
    `<canvas id="myChart" style="width:100%;max-width:1000px"></canvas>` +
    `<br>` +
    `<div id="stringify_data_phrases" style="background-color: white; padding: 10px;"></div>` +
    `<br><button onclick='cancel_btn_function()'>BACK</button><br>`;
}

function show_context_relations(question_input) {
  $.post(
    current_hosting_url + "php/js-request/show_context_relations.php",
    { question: question_input },
    function (data) {
      alert(data);
    }
  );
}

function open_file(input1, input2) {
  window.open(current_hosting_url + "user_files/" + input1 + "/" + input2);
}

function delete_file(input1, input2, input3) {
  $.post(
    current_hosting_url + "php/js-request/delete_teacher_file.php",
    { user_folder: input1, user_file: input2 },
    function (data) {
      alert(data);

      index = arr_teacher_filenames.indexOf(arr_teacher_filenames[input3]);
      if (index > -1) {
        // only splice array when item is found
        arr_teacher_filenames.splice(index, 1); // 2nd parameter means remove one item only
      }

      document.getElementsByClassName("delete-source")[input3].style.display =
        "none";
      document.getElementsByClassName("highlightable-sources")[
        input3
      ].style.display = "none";
      $.get(current_hosting_url + "php/nlp_all_steps.php", function () {
        load_references();
      });
    }
  );
}

function upload_file_function() {
  variable = document.getElementById("fileToUpload").value;
  variable = variable.replace("C:\\fakepath\\", "");
  // alert(variable);
  arr_filetypes = [".docx", ".doc", ".pdf", ".txt"];
  outcome = 0;
  for (i = 0; i < arr_filetypes.length; i++) {
    if (
      document.getElementById("fileToUpload").value.includes(arr_filetypes[i])
    ) {
      outcome++;
    }
  }
  if (outcome > 0) {
    // alert("upload");

    let formData = new FormData();
    formData.append("file", document.getElementById("fileToUpload").files[0]);
    fetch(current_hosting_url + "php/js-request/upload_teacher_file.php", {
      method: "POST",
      body: formData,
    }).then(
      $.get(current_hosting_url + "php/nlp_all_steps.php", function () {
        load_references();
      })
    );
    alert("you uploaded a file.");
    location.reload();
  } else {
    alert("Sorry, this website does not support that kind of file");
  }
}
