const dbConn = require("../config/db.config");
const ORM = require("../config/orm.config");
const { SuccessResp, ErrorResp } = require("../utils/common.utils");

module.exports.getAllCustomers = async () => {
  try {
    const getAllData = await ORM.executeQry(
      `SELECT * FROM store_customers WHERE deleted = '0' ORDER BY name ASC`,
      [],
    );

    if (getAllData.length > 0) {
      getAllData.map((cust) => delete cust.deleted);
      const SuccessResponse = SuccessResp();
      SuccessResponse.data = getAllData;
      return SuccessResponse;
    } else {
      throw new Error("No data found.");
    }
  } catch (err) {
    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  }
};

module.exports.getCustomerInfo = async (idx) => {
  try {
    const getCustomerData = await ORM.executeQry(
      `SELECT * FROM store_customers WHERE deleted = '0' AND id = ?`,
      [idx],
    );

    if (getCustomerData.length > 0) {
      getCustomerData.map((cust) => delete cust.deleted);

      const SuccessResponse = SuccessResp();
      SuccessResponse.data = getCustomerData;
      return SuccessResponse;
    } else {
      throw new Error("No data found.");
    }
  } catch (err) {
    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  }
};

module.exports.removeCustomerInfo = async (idx) => {
  try {
    const removeCustomer = await ORM.updateQry(
      `UPDATE store_customers SET deleted = '1' WHERE deleted = '0' AND id = ?`,
      [idx],
    );

    if (removeCustomer.affectedRows > 0) {
      const SuccessResponse = SuccessResp();
      SuccessResponse.message = "Customer deleted Successfully.";
      SuccessResponse.customer_id = idx;
      return SuccessResponse;
    } else {
      throw new Error("Delete failed. Please check customer details.");
    }
  } catch (err) {
    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  }
};

module.exports.CreateNewCustomer = async (data) => {
  let conn;

  try {
    console.log(data);

    const allowedFields = ["name", "email", "phone", "town"];

    // const optionalFields = [
    //   "address_1",
    //   "address_2",
    //   "country",
    //   "postcode",
    // ];

    const chkRequested = data.filter((field) => {
      const checkFields = allowedFields.filter((allow) => field[allow]);
      if (checkFields.length != allowedFields.length) {
        throw new Error("Required details missing.");
      }

      return checkFields;
    });

    conn = await dbConn.getConnection();
    await conn.beginTransaction();

    const getInsertedIdArr = [];

    for (const getInfo of chkRequested) {
      const name = getInfo.name;
      const phone = getInfo.phone;
      const email = getInfo.email;
      const town = getInfo.town;

      const [checkEmailExist] = await conn.execute(
        `SELECT COUNT(*) as check_email FROM store_customers WHERE deleted = '0' AND email = ?`,
        [email],
      );

      if (checkEmailExist[0].check_email > 0) {
        throw new Error("Email Id already exists.");
      }

      const [checkPhoneExist] = await conn.execute(
        `SELECT COUNT(*) as check_phone FROM store_customers WHERE deleted = '0' AND phone = ?`,
        [phone],
      );

      if (checkPhoneExist[0].check_phone > 0) {
        throw new Error("Phone Number already exists.");
      }

      const getRequested = [name, email, phone, town];

      console.log(getRequested)

      const insertString = String(allowedFields.join(", "));
      const valueString = allowedFields.map(() => "?").join(", ");

      const [addCustomer] = await conn.execute(
        `INSERT INTO store_customers (${insertString}) VALUES(${valueString})`,
        [...getRequested],
      );

      await conn.commit();

      if (addCustomer.insertId > 0) {
        getInsertedIdArr.push(addCustomer.insertId);
      }
    }

    if (getInsertedIdArr.length === data.length) {
      const SuccessResponse = SuccessResp();
      ((SuccessResponse.message = "Customer created successfully."),
        (SuccessResponse.customer_id = getInsertedIdArr));
      return SuccessResponse;
    } else {
      throw new Error("Unable to create customer, Please check your data");
    }
  } catch (err) {
    if (conn) {
      await conn.rollback();
    }

    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  }
};

module.exports.UpdateCustomerDetails = async (data) => {

  try {
    const allowedFields = [
      "name",
      "email",
      "address_1",
      "address_2",
      "town",
      "country",
      "postcode",
      "phone",
    ];

    if (!data.id) {
      throw new Error("Id is missing.");
    }

    const chkRequested = allowedFields.filter((field) => data[field]);
    const getRequested = chkRequested.map((field) => data[field]);

    if (chkRequested.length === 0) {
      throw new Error("No data requested to update, Please check.");
    }

    const { id } = data;

    const sqlQryArr = chkRequested.map((field) => `${field} = ?`);
    const sqlQry = `UPDATE store_customers SET ${String(sqlQryArr.join(", "))} WHERE deleted = '0' AND id = ?`;

    const updateCustomer = await ORM.updateQry(sqlQry, [...getRequested, id]);
    if (updateCustomer.affectedRows > 0) {
      const SuccessResponse = SuccessResp();
      ((SuccessResponse.message = "Customer details updated successfully."),
        (SuccessResponse.customer_id = id));
      return SuccessResponse;
    } else {
      throw new Error(
        "Unable to update Customer details, Please check your data",
      );
    }
  } catch (err) {
    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  }
};

module.exports.UpdateShippingDetails = async (data) => {
  try {
    if (!data.id) {
      throw new Error("Id is missing.");
    }

    const { id } = data;

    const allowedFields = [
      "name_ship",
      "address_1_ship",
      "address_2_ship",
      "town_ship",
      "country_ship",
      "postcode_ship",
    ];

    const chkRequested = allowedFields.filter((field) => data[field]);
    const getRequested = chkRequested.map((field) => data[field]);

    if (chkRequested.length === 0) {
      throw new Error("No data requested to update, Please check.");
    }

    const sqlQryArr = chkRequested.map((field) => `${field} = ?`);
    const sqlQry = `UPDATE store_customers SET ${String(sqlQryArr.join(", "))} WHERE deleted = '0' AND id = ?`;

    const updateCustomer = await ORM.updateQry(sqlQry, [...getRequested, id]);

    if (updateCustomer.affectedRows > 0) {
      const SuccessResponse = SuccessResp();
      ((SuccessResponse.message = "Customer details updated successfully."),
        (SuccessResponse.customer_id = id));
      return SuccessResponse;
    } else {
      throw new Error(
        "Unable to update customer details, Please check your data",
      );
    }
  } catch (err) {
    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  }
};
