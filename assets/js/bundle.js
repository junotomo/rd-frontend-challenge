(() => {
    const selector = selector => document.querySelector(selector);
    const create = element => document.createElement(element);
    const app = selector('#app');

    app.classList.add('container-login')

    const Login = create('div');
    Login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const Form = create('form');

    Form.onsubmit = async e => {
      e.preventDefault();
      const [email, password] = e.target.elements;

      const {url} = await fakeAuthenticate(email.value, password.value);
      location.href='#users';
      const users = await getDevelopersList(url);
      renderPageUsers(users);
    };

    Form.oninput = e => {
        const [email, password, button] = e.target.parentElement.children;
        (!email.validity.valid || !email.value || password.value.length <= 5)
            ? button.setAttribute('disabled','disabled')
            : button.removeAttribute('disabled');
    };

    Form.innerHTML = `
      <input type='text' name='email' placeholder='E-mail'>
      <input type='password' name='password' placeholder='Senha'>
      <button type='submit'class='send' disabled>Login</button>
    `

    app.appendChild(Logo);
    Login.appendChild(Form);

    async function fakeAuthenticate(email, password) {
      const response = await fetch("http://www.mocky.io/v2/5dba690e3000008c00028eb6")
      const data = await response.json()
      const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+300000}`;
      localStorage.setItem('token', fakeJwtToken)
      return data;
    }


    async function getDevelopersList(urlDev) {
      try {
        const response = await fetch(urlDev)
        const devList = await response.json()
        return devList
      } catch (e) {
        console.log(e)
      }

    }

    function renderPageUsers(users) {
      app.classList.add('logged');
      Login.style.display = 'none';
      const Ul = create('ul');
      Ul.classList.add('container')

      let devList="";
      users.forEach(user => {
        devList +=`
          <li class='devList-item'>
          <div class='devList-img'>
              <img src='${user.avatar_url}'/>
          </div>
            <span class='devList-username'>'${user.login}'</span>
          </li>
        `
      });

      Ul.innerHTML = devList;
      app.appendChild(Ul)
    }

    // init
    (async function(){
        const rawToken = localStorage.getItem('token');
        const token = rawToken ? rawToken.split('.') : null
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem('token');
            location.href='#login';
            app.appendChild(Login);
        } else {
            location.href='#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
        }
    })()
})()
