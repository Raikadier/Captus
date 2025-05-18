using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace BLL
{
    public class CategoryLogic : ILogic<Category>
    {
        private readonly CategoryRepository categoryRepository;
        public CategoryLogic()
        {
            categoryRepository = new CategoryRepository();
        }
        public OperationResult Delete(int id)
        {
            try
            {
                if (id <= 0) return new OperationResult
                {
                    Success = false,
                    Message = "Invalid category ID."
                };
                if (GetById(id) == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Category not found."
                    };
                }
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
                return categoryRepository.GetAll();
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
            catch (Exception )
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
            catch (Exception ex)
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
