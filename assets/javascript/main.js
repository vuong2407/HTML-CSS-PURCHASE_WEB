const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const apiUsers = "http://localhost:3000/users";
const apiNotify = "http://localhost:3000/notification";
var totalNotify = 0;

function start() {
  eventLogin();
  eventSignUp();
  eventHover();
  eventSignOut();
  eventScrollPurchaseItem();
}

start();

function eventLogin() {
  $(".btn-login").onclick = () => {
    $(".login").style.display = "block";
    $(".block-blur").style.display = "block";
    eventCloseForm(".login", 1);
    handleLogin();
  };
}

function eventSignUp() {
  $(".btn-sign-up").onclick = () => {
    $(".sign-up").style.display = "block";
    $(".block-blur").style.display = "block";
    eventCloseForm(".sign-up", 0);
    handleSignUp();
  };
}

function eventHover() {
  const totalNotifyElement = $(".number-notify");
  const notifyNotificationElement = $(".notify-notification");

  notifyNotificationElement.onmouseover = () => {
    if (totalNotifyElement.style.display == "block") {
      checkHoverNotification = true;
      totalNotifyElement.style.display = "none";
      renderNumberNofifyAll(Number(totalNotifyElement.innerText));
    }
  };
}

function eventSignOut() {
  const btnSignOutElement = $(".btn-sign-out");

  btnSignOutElement.onclick = () => {
    console.log("vuong");
  };
}

function eventScrollPurchaseItem() {
  $(".btn-scroll-right").onclick = () => {
    $(".purchase-list").scrollLeft += 500;
  };
  $(".btn-scroll-left").onclick = () => {
    $(".purchase-list").scrollLeft -= 500;
  };
}

function eventGetNotify(userLogined) {
  fetch(apiNotify)
    .then((response) => response.json())
    .then((dataResponse) => {
      const result = dataResponse.find((user) => {
        return user.user_name == userLogined;
      });
      const notifys = result.notify;
      handleNotifyNotification(notifys);
    });
}

function eventCloseForm(data, numElement) {
  $$(".ti-close")[numElement].onclick = () => {
    renderCloseForm(data);
  };
}

function handleLogin() {
  $(".btn-login-form").onclick = () => {
    const userInput = $('input[name="user-login"]').value;
    const passInput = $('input[name="password-login"]').value;
    const dataLogin = {
      user_name: userInput,
      password: passInput,
    };

    fetch(apiUsers)
      .then((response) => response.json())
      .then((dataResponse) => {
        const result = dataResponse.find((user) => {
          return (
            user.user_name == dataLogin.user_name &&
            user.password == dataLogin.password
          );
        });
        if (result) {
          alert("Login is successful!!");
          renderCloseForm(".login");
          renderLoginSuccess(result);
          eventGetNotify(result.user_name);
        } else {
          alert("Account is not Exist!!!");
        }
      });
  };
}

function handleSignUp() {
  $(".btn-sign-up-form").onclick = () => {
    const userFirstName = $('input[name="first-name"]').value;
    const userLastName = $('input[name="last-name"]').value;
    const userInput = $('input[name="user"]').value;
    const passInput = $('input[name="password"]').value;
    const passInputAgain = $('input[name="check-password"]').value;
    if (passInput == passInputAgain) {
      const data = {
        first_name: userFirstName,
        last_name: userLastName,
        user_name: userInput,
        password: passInput,
      };

      handleCheckAccountExist(data);
    } else {
      alert("password check is wrong!!!");
    }
  };
}

function handleCheckAccountExist(userChecked) {
  fetch(apiUsers)
    .then((response) => response.json())
    .then((dataResponse) => {
      return dataResponse.find(
        (user) => user.user_name == userChecked.user_name
      );
    })
    .then((result) => {
      console.log("vuong");
      if (!result) {
        handleCreateAccount(userChecked);
        alert("user is successful created!!!");
        renderCloseForm(".sign-up");
      } else {
        alert("Account Existed!!!!");
      }
    });
}

function handleCreateAccount(data) {
  fetch(apiUsers, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((dataResponse) => console.log(dataResponse));
}

function handleNotifyNotification(data) {
  const notificationElement = $(".notification");
  const totalNotifyElement = $(".number-notify");
  const numberNotifyAllElement = $(".notify-all");

  let html = "";

  if (data.length != 0) {
    data.forEach((notify) => {
      html += `<li>${notify}</li>`;
    });
    totalNotify += data.length;
    notificationElement.innerHTML = html;
    totalNotifyElement.innerText = data.length;
    totalNotifyElement.style.display = "block";
    numberNotifyAllElement.innerText =
      Number(numberNotifyAllElement.innerText) + Number(totalNotify);
    numberNotifyAllElement.style.display = "block";
  }
}

function renderLoginSuccess(userLogin) {
  $(".info-login").style.display = "block";
  $(".nav-list:nth-child(2)").style.display = "none";
  const firstName = userLogin.first_name;
  const lastName = userLogin.last_name;
  const avatar = (userLogin.avatar(".user").innerText =
    "Welcom " + firstName + " " + lastName);
  if (avatar) {
    $(".avatar").style.backgroundImage = `url(${avatar})`;
  }
}

function renderCloseForm(data) {
  $(data).style.display = "none";
  $(".block-blur").style.display = "none";
  $('input[name="user"]').value = "";
  $('input[name="password"]').value = "";
  $('input[name="check-password"]').value = "";
  $('input[name="user-login"]').value = "";
  $('input[name="password-login"]').value = "";
}

function renderNumberNofifyAll(number) {
  const numberNotifyAllElement = $(".notify-all");
  const numberNotifyDescreased =
    Number(numberNotifyAllElement.innerText) - number;
  console.log(numberNotifyDescreased);

  if (numberNotifyDescreased == 0) {
    numberNotifyAllElement.style.display = "none";
  } else {
    numberNotifyAllElement.innerText = numberNotifyDescreased;
  }
}
