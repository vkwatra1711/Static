$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
const API_URL = 'http://localhost:5000/api';
const currentUser = localStorage.getItem('user');
const MQTT_URL = 'http://localhost:5001/send-command';


$.get('/auth/google/user', (res) => {
  console.log("get runs");
  const logGoogle = localStorage.getItem('logGoogle');
  console.log("Log google is apparently " + logGoogle);
  if (logGoogle) {
    console.log("This is true");
    localStorage.setItem('user', res.name);
    localStorage.setItem('isAdmin', res.isAdmin);
    localStorage.setItem('isAuthenticated', true);
  }
});



if (currentUser) {
  $.get(`${API_URL}/users/${currentUser}/devices`)
    .then(response => {
      response.forEach((device) => {
        $('#devices tbody').append(`
          <tr data-device-id=${device._id}>
            <td>${device.user}</td>
            <td>${device.name}</td>
          </tr>`
        );
      });
      $('#devices tbody tr').on('click', (e) => {
        const deviceId = e.currentTarget.getAttribute('data-device-id');
        $.get(`${API_URL}/devices/${deviceId}/device-history`)
          .then(response => {
            response.map(sensorData => {
              $('#historyContent').append(`
              <tr>
                <td>${sensorData.ts}</td>
                <td>${sensorData.temp}</td>'
                <td>${sensorData.loc.lat}</td>
                <td>${sensorData.loc.lon}</td>
              </tr>
            `);
            });
            $('#historyModal').modal('show');
          });
      });
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
}
else if (localStorage.getItem('logGoogle')) {
  const currentUser = localStorage.getItem('user');
  $.get(`${API_URL}/users/${currentUser}/devices`)
    .then(response => {
      response.forEach((device) => {
        $('#devices tbody').append(`
                <tr data-device-id=${device._id}>
                    <td>${device.user}</td>
                    <td>${device.name}</td>
                </tr>`
        );
      });
      $('#devices tbody tr').on('click', (e) => {
        const deviceId = e.currentTarget.getAttribute('data-device-id');
        $.get(`${API_URL}/devices/${deviceId}/device-history`)
          .then(response => {
            response.map(sensorData => {
              $('#historyContent').removeClass().text("");
              $('#historyContent').append(`
                    <tr>
                        <td>${sensorData.ts}</td>
                        <td>${sensorData.temp}</td>
                        <td>${sensorData.loc.lat}</td>
                        <td>${sensorData.loc.lon}</td>
                    </tr>
                    `);
            });
            $('#historyModal').modal('show');
          });
      });
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
}
else {
  const path = window.location.pathname;
  if (path !== '/login' && path !== '/registration') {
    location.href = '/login';
  }
}



//const devices = JSON.parse(localStorage.getItem('devices')) || [];
//const response = $.get('http://localhost:3001/devices');
//console.log(response);

/*
devices.forEach(function(device) {
$('#devices tbody').append(`
<tr>
<td>${device.user}</td>
<td>${device.name}</td>
</tr>`
);
});
*/
$.get(`${API_URL}/devices`)
  .then(response => {
    response.forEach(device => {
      $('#devices tbody').append(`
 <tr>
 <td>${device.user}</td>
 <td>${device.name}</td>
 </tr>`
      );
    });
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });

$.get(`${API_URL}/stores`)
  .then(response => {
    response.forEach(store => {
      $('#stores tbody').append(`
      <tr data-store-id=${store._id}>
 <tr>
 <td>${store.storeId}</td>
 <td>${store.location.formattedAddress}</td>
 </tr>`
      );
    });
  })
$('#stores tbody tr').on('click', (e) => {
  const storeId = e.currentTarget.getAttribute('data-store-id');
  console.log("vansh");
  $.get(`${API_URL}/${storeId}/fridges`)
    .then(response => {
      response.map(Fridges => {

        $('#historyContents').append(`
          <tr>
            <td>${Fridges.fridgename}</td>
          </tr>
        `);
      });
    });
});
/*
const response = $.get('http://localhost:3001/devices');
console.log(response);
*/
$('#add-device').on('click', () => {
  const name = $('#name').val();
  const user = $('#user').val();
  const sensorData = [];
  const body = {
    name,
    user,
    sensorData
  };

  $.post(`${API_URL}/devices`, body)
    .then(response => {
      location.href = '/';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
})
$('#send-command').on('click', function () {
  const deviceId = $('#deviceId').val();
  const command = $('#command').val();

  $.post(`${MQTT_URL}`, { deviceId, command })
    .then((response) => {
      if (response.success) {
        location.href = '/';
      }
    })
});

$('#register').on('click', () => {
  const user = $('#user').val();
  const password = $('#password').val();
  const confirm = $('#confirm').val();
  if (password !== confirm) {
    $('#message').append('<p class="alert alert-danger">Passwords do not match</p>');
  } else {
    $.post(`${API_URL}/register`, { user, password })
      .then((response) => {
        if (response.success) {
          location.href = '/login';
        } else {
          $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
      });
  }
});

$('#save').on('click', () => {
  const storeId = $('#store-id').val();
  const address = $('#store-address').val();
  const location = []

  $.post(`${API_URL}/stores`, { storeId, address })
  location.href = '/store-list';
});
/** $('#submit').on('click', function () {
  const deviceId = $('#deviceId').val();
  const command = $('#command').val();

  $.post(`${MQTT_URL}`, { deviceId, command })
    .then((response) => {
      if (response.success) {
        location.href = '/';
      }
    })
});*/
/** 
$('#submit').on('click', function () {
  const storeId = $('#store-id').val();
  const fridgeId = $('#fridge-id').val();
  const fridgename = $('#fridge-name').val();

})*/





/*$('#login').on('click',function(){
    const username = $('#username').val();
    const password = $('#password').val();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exist = users.find(user => user.username === username);
    const exists = users.find(user => user.password === password);
    if(exist == undefined )
    {
        $("#message").text("User doesn't exist");
    }
    else
    {
        if(exists == undefined)
        {
            $("#message").text("Password does not match.");
        }
        else
        {
            localStorage.setItem('isAuthenticated', JSON.stringify(true));
            location.href = '/'
        }
    }
});*/
$('#login').on('click', () => {
  const user = $('#user').val();
  const password = $('#password').val();
  $.post(`${API_URL}/authenticate`, { user, password })
    .then((response) => {
      if (response.success) {
        localStorage.setItem('user', user);
        localStorage.setItem('isAdmin', response.isAdmin);
        location.href = '/';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}
   </p>`);
      }
    });
});
$('#logingoogle').on('click', (req, res) => {
  localStorage.setItem('logGoogle', true);
  location.href = '/auth/google';
});
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('is Authenticated');
  localStorage.removeItem('logGoogle');

  location.href = '/login';
}
