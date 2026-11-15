import { Box, Container, Typography } from '@mui/material';
import { useState } from 'react';
import {
    Link,
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from 'react-router-dom';
import { Create } from './components/Create';
import { Navbar } from './components/Navbar';
import { SignIn } from './components/Sign-in';
import { BookDetails } from './features/search/book-details';
import { SearchResults } from './features/search/search-results';

export const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Box>
                <Navbar isAuthenticated={isAuthenticated} />

                <Container style={{ padding: '20px' }}>
                    <Routes>
                        <Route
                            path='/signin'
                            element={
                                <SignIn
                                    onSignIn={() => setIsAuthenticated(true)}
                                />
                            }
                        />
                        <Route
                            path='/'
                            element={<Navigate to='/search-results' replace />}
                        />
                        <Route
                            path='/search-results'
                            element={<SearchResults />}
                        />
                        <Route
                            path='/book-details/:isbn'
                            element={<BookDetails />}
                        />
                        <Route
                            path='/create'
                            element={
                                isAuthenticated ? (
                                    <Create />
                                ) : (
                                    <Navigate to='/signin' />
                                )
                            }
                        />
                    </Routes>
                </Container>
                <Box
                    component='footer'
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    <Typography variant='body2'>
                        &copy; 2024 Philip Neuffer, Botan Coban, Felix Jaeger
                    </Typography>
                    <Typography variant='body2'>
                        <Link to='./LICENSE' target='_blank' rel='noopener'>
                            LICENSE
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Router>
    );
};
