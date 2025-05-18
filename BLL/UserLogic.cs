using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace BLL
{
    public class UserLogic : ILogic<User>
    {
        private readonly UserRepository userRepository;
        public UserLogic()
        {
            userRepository = new UserRepository();
        }
        public OperationResult Delete(int id)
        {
            try
            {
                if (GetById(id) == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "User not found."
                    };
                }
                if (id <= 0) return new OperationResult
                {
                    Success = false,
                    Message = "Invalid user ID."
                };
                if (userRepository.Delete(id))
                {
                    return new OperationResult
                    {
                        Success = true,
                        Message = "User deleted successfully."
                    };
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Failed to delete user."
                    };
                }
            }
            catch (Exception ex)
            {
                return new OperationResult
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                };
            }
        }
        public List<User> GetAll()
        {
            try
            {
                return userRepository.GetAll();
            }
            catch (Exception ex)
            {
                return null;
                throw new Exception($"An error occurred while retrieving users: {ex.Message}");
            }
        }
        public User GetById(int id)
        {
            try
            {
                return userRepository.GetById(id);
            }
            catch (Exception ex)
            {
                return null;
                throw new Exception($"An error occurred while retrieving the user: {ex.Message}");
            }
        }
        public User GetByUsername(string username)
        {
            try
            {
                return userRepository.GetByUsername(username);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public OperationResult Save(User user)
        {
            try
            {
                if (user == null) return new OperationResult
                {
                    Success = false,
                    Message = "User cannot be null."
                };
                if (GetById(user.id) != null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "User already exists."
                    };
                }
                if(GetByUsername(user.UserName) != null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Username already exists."
                    };
                }
                if (userRepository.Save(user))
                {
                    return new OperationResult
                    {
                        Success = true,
                        Message = "User inserted successfully."
                    };
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Failed to insert user."
                    };
                }
            }
            catch (Exception ex)
            {
                return new OperationResult
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                };
            }
        }
        public OperationResult Update(User user)
        {
            try
            {
                if (user == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "User cannot be null."
                    };
                }
                if (GetById(user.id) != null)
                {
                    if (userRepository.Update(user))
                    {
                        return new OperationResult
                        {
                            Success = true,
                            Message = "User updated successfully."
                        };
                    }
                    else
                    {
                        return new OperationResult
                        {
                            Success = false,
                            Message = "Failed to update user."
                        };
                    }
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "User not found."
                    };
                }
            }
            catch (Exception ex)
            {
                return new OperationResult
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                };
            }
            
        }
        public User Login(string username, string password)
        {
            
            try
            {
                User user = new User();
                if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                {
                    return null;
                }
                user = userRepository.Login(username, password);
                Session.End();
                Session.Start(user);
                return user;
            }
            catch (Exception)
            {
                return null;
            }
        }
        public void Logout()
        {
            Session.End();
        }
    }
}
