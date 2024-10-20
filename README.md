
# Hints

### this is an example of how to handle api calls

if (response.ok) {

  const data = await response.json();
  
  console.log(data.message); // 'Login successful'
  
} else if (response.status === 401) {

  console.log('Invalid credentials');
  
} else if (response.status === 400) {

  console.log('User not found');
  
} else {

  console.log('An unexpected error occurred');
  
}


# API calls

## signup

!!! follow order of execution

1-
/users/send-verification

body:

{

  "email": "",
  
  "password": ""
  
}

2-
/users/verify-code

body:

{

  "email": "",
  
  "code": ""
  
}

3-
/users/register

body:

{

  "email": "",

  "user_name": ""

}




