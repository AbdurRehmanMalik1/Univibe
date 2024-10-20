
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




