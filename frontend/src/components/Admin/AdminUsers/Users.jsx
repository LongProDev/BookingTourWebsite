import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'reactstrap';
import { BASE_URL } from '../../../utils/config';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setUsers(result.data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`${BASE_URL}/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-users p-4">
      <h2>Users Management</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Badge color={user.role === 'admin' ? 'danger' : 'info'}>
                  {user.role}
                </Badge>
              </td>
              <td>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleDeleteUser(user._id)}
                  disabled={user.role === 'admin'}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;