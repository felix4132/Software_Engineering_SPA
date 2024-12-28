import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { EmailSchema, PasswordSchema } from '../features/auth/lib/validators';

const tokenUrl: string = import.meta.env.VITE_TOKEN_URL as string;

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [JWT, setJWT] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate: NavigateFunction = useNavigate();

  //TODO useEffect und lokalStorage
  /*this is needed due to the asynchronous nature of updating stateful react variables
    otherwise the post request could occasionally be run before the 'setEmailError' and 'setPasswordError' functions finish executing
  */

  useEffect(() => {
    try {
      EmailSchema.parse(email);
      setEmailError(''); // Clear the error if no exception is thrown
    } catch (e) {
      if (e instanceof z.ZodError) {
        setEmailError(e.errors[0].message);
      }
    }
  }, [email]);

  useEffect(() => {
    try {
      PasswordSchema.parse(password);
      setPasswordError(''); // Clear the error if no exception is thrown
    } catch (e) {
      if (e instanceof z.ZodError) {
        setPasswordError(e.errors[0].message);
      }
    }
  }, [password]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post(tokenUrl, {
        username: email,
        password: password,
      })
      .then((result) => {
        console.log('JWT:\n', result.data.access_token);
        console.log('refresh:\n', result.data.refresh_token);

        //Reset email and password so they are not exposed longer then needed
        setEmail('');
        setPassword('');

        navigate('/');
      })
      .catch((e: AxiosError) => {
        if (e.status === 401) {
          e.message = 'The username or password you provided is incorrect';
        }
        setPasswordError(e.message);
        setEmailError(e.message);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!!emailError || !!passwordError}
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Container>
  );
};
