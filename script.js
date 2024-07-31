"use strict";
$(window).ready(() => {
  //    VARAIBLES

  const budgetInput = document.getElementById("budgetInput");
  const productInput = document.getElementById("productTitleInput");
  const productCostInput = document.getElementById("productCostInput");
  let totalBudget = document.querySelector(".totalBudget");
  let Expanses = document.querySelector(".Expanses");
  let Balance = document.querySelector(".Balance");
  let ol = document.getElementById("save");

  //     BUTTONS

  const setBudget = document.getElementById("setBudget");
  const checkAmount = document.getElementById("checkAmount");
  const newBudget = document.getElementById("newBudget");
  const numberRegex = /\d/;
  //    Store values

  let sum = 0;
  let minus = 0;
  let currentBalance;
  let localSet = [];

  //   all clear function

  $("#Clear").on("click", () => {
    //  create a confirm if reture true so run de task when reture false so run nothing
    Swal.fire({
      title: "Are you sure?",
      text: "You will lose all your data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        ol.innerHTML = "";
        Expanses.innerHTML = "0";
        Balance.innerHTML = "0";
        totalBudget.innerHTML = "0";
        sum = 0;
        minus = 0;
        productCostInput.value = "";
        productInput.value = "";
        budgetInput.value = "";
        Swal.fire("Deleted!", "Your data has been deleted.", "success");
      }
    });
  });

  //     set new Budget

  $(newBudget).on("click", () => {
    Swal.fire({
      title: "Enter a new budget",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Set",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: (input) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (isNaN(parseInt(input)) || parseInt(input) <= 0) {
              Swal.showValidationError("Please enter a valid positive number");
            } else {
              let input1 = parseInt(input);
              totalBudget.innerHTML = input1;
              minus = input1;
              localStorage.setItem("Budget", input1);
              if (input < sum) {
                Balance.innerHTML = sum - input;
                Swal.fire({
                  title: "Budget set successfully",
                  icon: "success",
                  timer: 1500,
                });
              } else {
                Balance.innerHTML = input - sum;
                Swal.fire({
                  title: "Budget set successfully",
                  icon: "success",
                  timer: 1500,
                });
              }
            }
          }, 2000);
        });
      },
    });
  });

  //    lets create click function

  function del() {
    let cost = parseInt($(this).parent().find("#price").text());
    // for (const obj of JSON.parse(localStorage.getItem("Cost and Product"))) {
    //   if (cost == obj.Cost) {
    //     // let saveCost = obj.Cost
    //     delete obj.Cost
    //     console.log(obj);
    //     setTimeout(()=>{

    //       console.log(localSet);
    //     },2000)
    //   }
    // }
    sum -= cost;
    currentBalance = minus - sum;
    Balance.innerHTML = currentBalance;
    Expanses.innerHTML = sum;
    $(this).parent().remove();
  }

  function showSaveItem() {
    if (
      localStorage.getItem("Budget") != null &&
      localStorage.getItem("Cost and Product") != null
    ) {
      minus = localStorage.getItem("Budget");
      totalBudget.innerHTML = localStorage.getItem("Budget");
      for (let obj of JSON.parse(localStorage.getItem("Cost and Product"))) {
        localSet.push(obj);
        sum += obj.Cost;
        currentBalance = minus - sum;
        ol.innerHTML += `
          <li>
          <p id="Product">${obj.Product}</p> 
          <P id="price">${obj.Cost}</P>
          <button class="delete_button"><i class="fa-solid fa-trash"></i></button>
        </li>
        `;
        $(".delete_button").click(del);
      }
      Balance.innerHTML = currentBalance;
      Expanses.innerHTML = sum;
    }
  }

  showSaveItem();

  $(budgetInput).on("keypress", (e) => {
    if (e.key == "Enter") {
      budgetSet();
      productInput.focus();
    }
  });
  $(setBudget).on("click", budgetSet);

  function budgetSet() {
    let budget = parseInt(budgetInput.value);
    if (isNaN(budget) || budget <= 0) {
      Swal.fire({
        title: "Please enter a valid positive number",
        icon: "error",
      });
      budgetInput.value = "";
      return;
    } else {
      localStorage.setItem("Budget", budget);
      minus = JSON.parse(localStorage.getItem("Budget"));
      totalBudget.innerHTML = localStorage.getItem("Budget");
      budgetInput.value = "";
    }
  }

  $(productCostInput).on("keypress", (e) => {
    if (e.key == "Enter") {
      amountCheck();
    }
  });

  $(productInput).on("keypress", (e) => {
    if (e.key == "Enter") {
      productCostInput.focus();
    }
  });

  $(checkAmount).on("click", amountCheck);
  function amountCheck() {
    let product = productInput.value;
    let cost = parseInt(productCostInput.value);

    if (cost <= 0) {
      Swal.fire({
        title: "Please enter a positive cost",
        icon: "error",
      });
      productCostInput.value = "";
      return;
    } else if (numberRegex.test(product)) {
      Swal.fire({
        title: "Please enter a valid product name",
        icon: "error",
      });
      productInput.value = "";
      return;
    } else if (product == "" || cost == "") {
      Swal.fire({
        title: "Please fill all the fields",
        icon: "warning",
      });
      return;
    } else if (isNaN(cost)) {
      Swal.fire({
        title: "Enter only numbers",
        icon: "warning",
      });
      productCostInput.value = "";
      return;
    } else {
      let obj1 = {
        Cost: cost,
        Product: product,
      };
      localSet.push(obj1);
      let store = JSON.stringify(localSet);
      localStorage.setItem("Cost and Product", store);

      sum += cost;
      currentBalance = minus - sum;

      if (currentBalance < 0 || sum < 0) {
        Swal.fire({
          title: "Your balance is insufficient",
          icon: "warning",
        });
      } else {
        Balance.innerHTML = currentBalance;
        Expanses.innerHTML = sum;
        productInput.value = "";
        productCostInput.value = "";

        ol.innerHTML += `
          <li>
          <p id="Product">${product}</p> 
          <P id="price">${cost}</P>
          <button class="delete_button"><i class="fa-solid fa-trash"></i></button>
        </li>
             `;

        //   delete item
        $(".delete_button").click(del);
      }
    }
  }
});
