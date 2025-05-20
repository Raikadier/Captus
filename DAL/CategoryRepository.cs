using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTITY;

namespace DAL
{
    public class CategoryRepository : BDRepository<Category>
    {
        public CategoryRepository() { }
        public override bool Delete(int id)
        {
            try
            {
                if (id <= 0) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("DELETE FROM [dbo].[Category] WHERE Id_Category= @Id_Category", bd.connection);
                cmd.Parameters.Add("@Id_Category", SqlDbType.Int).Value = id;
                return cmd.ExecuteNonQuery() > 0;
            }
            finally
            {
                bd.CloseConection();
            }
        }
        public override List<Category> GetAll()
        {
            List<Category> categories = new List<Category>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Category]", bd.connection);
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    categories.Add(MappingType(reader));
                }
                reader.Close();
            }
            catch (SqlException)
            {
                return null;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                bd.CloseConection();
            }
            return categories;
        }

        public override Category GetById(int id)
        {
            Category category = null;
            try
            {
                if (id <= 0) return null;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Category] WHERE Id_Category=@Id_Category", bd.connection);
                cmd.Parameters.Add("@Id_Category", SqlDbType.Int).Value = id;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        category = MappingType(reader);
                    }
                }
            }
            finally
            {
                bd.CloseConection();
            }
            return category;
        }
        public Category GetByName(string name)
        {
            Category category = null;
            try
            {
                if (string.IsNullOrEmpty(name)) return null;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Category] WHERE Name=@Name", bd.connection);
                cmd.Parameters.AddWithValue("@Name", name);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    category = MappingType(reader);
                }
                reader.Close();
            }
            catch (SqlException)
            {
                return null;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                bd.CloseConection();
            }
            return category;
        }
        public override Category MappingType(SqlDataReader reader)
        {
            Category category = new Category();
            category.id = Convert.ToInt32(reader["Id_Category"]);
            category.Name = reader["Name"].ToString();

            if (reader["Id_User"] != DBNull.Value)
                category.Id_User = Convert.ToInt32(reader["Id_User"]);
            else
                category.Id_User = null;

            return category;
        }
        public List<Category> GetByUser(int userId)
        {
            List<Category> categories = new List<Category>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand(
                    "SELECT * FROM [dbo].[Category] WHERE Id_User = @Id_User OR Id_User IS NULL",
                    bd.connection
                );
                cmd.Parameters.Add("@Id_User", SqlDbType.Int).Value = userId;
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    categories.Add(MappingType(reader));
                }
                reader.Close();
            }
            finally
            {
                bd.CloseConection();
            }
            return categories;
        }
        public override bool Update(Category entity)
        {
            try
            {
                if (entity.id <= 0 || string.IsNullOrWhiteSpace(entity.Name)) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("UPDATE [dbo].[Category] SET Name=@Name WHERE Id_Category=@Id_Category", bd.connection);
                cmd.Parameters.AddWithValue("@Id_Category", entity.id);
                cmd.Parameters.AddWithValue("@Name", entity.Name);
                int affectedRows = cmd.ExecuteNonQuery();
                if (affectedRows > 0) return true;
                return false;
            }
            catch (SqlException)
            {
                bd.CloseConection();
                return false;
            }
            catch (Exception)
            {
                bd.CloseConection();
                return false;
            }
            finally
            {
                bd.CloseConection();
            }
        }
    }
}
