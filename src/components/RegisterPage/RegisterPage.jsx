import React from 'react';

import { useNavigate } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';
import { useTheme } from '@mui/styles';
import { makeStyles } from '@mui/material';

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div>
      <RegisterForm />

      <center>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            navigate('/login');
          }}
        >
          Login
        </button>
      </center>
    </div>
  );
}

export default RegisterPage;
