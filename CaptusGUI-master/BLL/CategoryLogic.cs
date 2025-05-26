using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using ENTITY;

namespace BLL
{
    public class CategoryLogic : ILogic<Category>
    {
        private readonly CategoryRepository categoryRepository;
        private readonly TaskLogic taskLogic;
        public CategoryLogic()
        {
            categoryRepository = new CategoryRepository();
            taskLogic = new TaskLogic();
        }
        public OperationResult Delete(int id)
        {
            try
            {
                var category = GetById(id);
                if (id <= 0) return new OperationResult
                {
                    Success = false,
                    Message = "Invalid category ID."
                };
                if (category == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Category not found."
                    };
                }
                if (category.id == 1)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Cannot delete the General category."
                    };
                }
                if (category.Name == "General")
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Cannot delete the General category."
                    };
                }
                taskLogic.DeleteByCategory(id);
                if (categoryRepository.Delete(id))
                {
                    return new OperationResult
                    {
                        Success = true,
                        Message = "Category deleted successfully."
                    };
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Failed to delete category."
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

        public List<Category> GetAll()
        {
            try
            {
                return categoryRepository.GetAll().Where(c => c.Id_User == Session.CurrentUser.id || c.Id_User == null).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Category GetById(int id)
        {
            try
            {
                if (id <= 0) return null;
                return categoryRepository.GetById(id);
            }
            catch (Exception)
            {
                return null;
            }
        }
        public Category GetByName(string name)
        {
            try
            {
                if (string.IsNullOrEmpty(name)) return null;
                return categoryRepository.GetByName(name);
            }
            catch (Exception)
            {
                return null;
            }
        }
        public OperationResult Save(Category category)
        {
            try
            {
                if (category == null) return new OperationResult
                {
                    Success = false,
                    Message = "Category cannot be null."
                };
                if (GetByName(category.Name) != null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Category already exists."
                    };
                }
                if (categoryRepository.Save(category))
                {
                    return new OperationResult
                    {
                        Success = true,
                        Message = "Category inserted successfully."
                    };
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Failed to insert category."
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

        public OperationResult Update(Category category)
        {
            try
            {
                if (category == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Category cannot be null."
                    };
                }
                if (category.id == 1)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Cannot update the General category."
                    };
                }
                if (GetById(category.id) != null)
                {
                    if (categoryRepository.Update(category))
                    {
                        return new OperationResult
                        {
                            Success = true,
                            Message = "Category updated successfully."
                        };
                    }
                    else
                    {
                        return new OperationResult
                        {
                            Success = false,
                            Message = "Failed to update category."
                        };
                    }
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Category not found."
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
    }
}
