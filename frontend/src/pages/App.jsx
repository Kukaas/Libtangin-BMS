import UserView from './pages/private/secretary/users/UserView';

<Route path="/secretary/users/:id/view" element={
    <PrivateRoute>
        <UserView />
    </PrivateRoute>
} />
