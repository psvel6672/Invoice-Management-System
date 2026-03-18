const dbConn = require("../config/db.config");
const {
  SuccessResp,
  ErrorResp,
  generateInvoiceNo,
} = require("../utils/common.utils");

module.exports.getAllInvoiceList = async () => {
  let conn;

  try {
    conn = await dbConn.getConnection();
    await conn.beginTransaction();

    const [getInvoiceList] = await conn.execute(
      `SELECT * FROM invoices WHERE deleted = '0' ORDER BY id DESC`,
      [],
    );

    if (getInvoiceList.length > 0) {
      const SuccessResponse = SuccessResp();
      SuccessResponse.data = getInvoiceList;
      return SuccessResponse;
    } else {
      throw new Error("No data found.");
    }
  } catch (err) {
    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports.getInvoiceItems = async (id) => {
  let conn;

  try {
    conn = await dbConn.getConnection();
    await conn.beginTransaction();

    const getInvoiceList = await conn.execute(
      `SELECT * FROM invoice_items WHERE deleted = '0' AND invoice_no = ? ORDER BY id ASC`,
      [id],
    );

    if (getInvoiceList[0].length > 0) {
      const SuccessResponse = SuccessResp();
      SuccessResponse.total = getInvoiceList[0].length;
      SuccessResponse.data = getInvoiceList[0];
      return SuccessResponse;
    } else {
      throw new Error("No data found.");
    }
  } catch (err) {
    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports.CreateInvoice = async (data) => {

  let conn;

  try {
    const optionalFields = ["custom_email", "notes", "shipping",];

    const allowedFields = [
      "invoice_date",
      "invoice_due_date",
      "invoice_type",
      "status",
      "paid_via",
      "subtotal",
      "discount",
      "tax",
      "total",
    ];

    const allowedInvoiceItems = [
      "product_id",
      "quantity",
      "tax",
      "price",
      "discount",
      "subtotal",
    ];

    const chkFieldExist = allowedFields.filter((field) => data[field]);

    if (allowedFields.length !== chkFieldExist.length || !data["invoice_product_info"]) {
      throw new Error("Required details missing.");
    }

    const getInvoiceData = data["invoice_product_info"];
    let invoiceItemsLen = getInvoiceData.length;

    if (invoiceItemsLen === 0) {
      throw new Error("Required Invoice Item details missing.");
    }

    let InvoiceItemsRowCheck = 1;

    const chkInvoiceItemsFieldExist = getInvoiceData.filter((field) => {
      const getCheck = allowedInvoiceItems.filter(
        (allowfield) => field[allowfield],
      );
      if (getCheck.length !== allowedInvoiceItems.length) {
        throw new Error(
          "Required Invoice Item details missing." +
            `- Row ${InvoiceItemsRowCheck}`,
        );
      }
      InvoiceItemsRowCheck++;
      return field;
    });

    const getAllowedFields = chkFieldExist.map((field) => data[field]);
    const chkOptionalFields = optionalFields.filter((field) => data[field]);

    const getcustomer_info = data["customer_info"];
    const getCustInfoId = getcustomer_info.custInfoId;

    chkFieldExist.push("customer_id");
    getAllowedFields.push(getCustInfoId);

    chkFieldExist.push("invoice_no");

    const getInvoiceNo = await generateInvoiceNo();

    getAllowedFields.push(getInvoiceNo);

    let getOptionalFields = [];
    let sqlQry = String(chkFieldExist.join(", "));

    if (chkOptionalFields.length > 0) {
      getOptionalFields = chkOptionalFields.map((field) => data[field]);
      sqlQry += ", " + String(chkOptionalFields.join(", "));
    }

    const sqlParams = [...getAllowedFields, ...getOptionalFields];
    const wantedQmarks = sqlParams.map((field) => "?");

    const prepareSQL = `INSERT INTO invoices (${sqlQry}) VALUES (${wantedQmarks})`;

    conn = await dbConn.getConnection();
    await conn.beginTransaction();

    const [execQry] = await conn.execute(prepareSQL, [...sqlParams]);

    if (execQry.insertId > 0) {
      // Insert invoice_items

      allowedInvoiceItems.push("invoice_no");
      let sqlQry = String(allowedInvoiceItems.join(", "));
      let sqlParams = allowedInvoiceItems.map((field) => "?").join(", ");

      const getInvoiceIdArr = [];

      for (let item of chkInvoiceItemsFieldExist) {
        const getFieldValues = [
          item.product_id,
          item.quantity,
          item.tax,
          item.price,
          item.discount,
          item.subtotal,
          getInvoiceNo,
        ];
        const prepareQry = `INSERT INTO invoice_items (${sqlQry}) VALUES(${sqlParams})`;
        const [getInsert] = await conn.execute(prepareQry, [...getFieldValues]);

        if (getInsert.insertId > 0) {
          getInvoiceIdArr.push(getInsert.insertId);
        }
      }

      if (invoiceItemsLen !== getInvoiceIdArr.length) {
        throw new Error("Unable to submit Invoice, Please check your data.");
      }

      const SuccessResponse = SuccessResp();
      SuccessResponse.message = "Invoice submitted successfully.";
      SuccessResponse.invoice_no = getInvoiceNo;
      return SuccessResponse;
    } else {
      throw new Error("Unable to create invoice, Please check your data.");
    }
  } catch (err) {
    if (conn) {
      await conn.rollback();
    }

    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports.DeleteInvoice = async (invoice_no) => {
  let conn;

  try {
    conn = await dbConn.getConnection();
    await conn.beginTransaction();

    const [getDeleteInvoice] = await conn.execute(
      `UPDATE invoices SET deleted = '1' WHERE deleted = '0' AND invoice_no = ?`,
      [invoice_no],
    );

    if (getDeleteInvoice.affectedRows > 0) {
      const [getDeleteInvoiceItems] = await conn.execute(
        `UPDATE invoice_items SET deleted = '1' WHERE deleted = '0' AND invoice_no = ?`,
        [invoice_no],
      );

      if (getDeleteInvoiceItems.affectedRows > 0) {
        const SuccessResponse = SuccessResp();
        SuccessResponse.message = "Invoice deleted successfully.";
        SuccessResponse.invoice_no = invoice_no;
        return SuccessResponse;
      } else {
        throw new Error("Unable to delete, please check the data.");
      }
    } else {
      throw new Error("Unable to delete, please check the data.");
    }
  } catch (err) {
    if (conn) {
      await conn.rollback();
    }

    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports.DeleteInvoiceItem = async (id) => {
  let conn;

  try {
    conn = await dbConn.getConnection();
    await conn.beginTransaction();

    const [getDeleteInvoice] = await conn.execute(
      `UPDATE invoice_items SET deleted = '1' WHERE deleted = '0' AND id = ?`,
      [id],
    );

    if (getDeleteInvoice.affectedRows > 0) {
      const SuccessResponse = SuccessResp();
      SuccessResponse.message = "Invoice item deleted successfully.";
      return SuccessResponse;
    } else {
      throw new Error("Unable to delete, please check the data.");
    }
  } catch (err) {
    if (conn) {
      await conn.rollback();
    }

    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports.UpdateInvoice = async (data) => {
  let conn;

  try {
    if (!data.invoice_no) {
      throw new Error("Required details missing.");
    }

    const allowedFields = [
      "invoice_date",
      "invoice_due_date",
      "subtotal",
      "shipping",
      "discount",
      "tax",
      "total",
      "invoice_type",
      "status",
      "custom_email",
      "notes",
    ];

    const chkFieldExist = allowedFields.filter((field) => data[field]);

    if (chkFieldExist.length === 0) {
      throw new Error("Required details missing.");
    }

    const getAllowedFields = chkFieldExist.map((field) => data[field]);
    const sqlQry = chkFieldExist.map((field) => `${field} = ?`);

    const prepareSQL = `UPDATE invoices SET ${sqlQry} WHERE deleted = '0' AND invoice_no = ?`;

    conn = await dbConn.getConnection();
    await conn.beginTransaction();

    const [execQry] = await conn.execute(prepareSQL, [
      ...getAllowedFields,
      data.invoice_no,
    ]);

    if (execQry.affectedRows > 0) {
      const SuccessResponse = SuccessResp();
      SuccessResponse.message = "Invoice updated successfully.";
      SuccessResponse.invoice_no = data.invoice_no;
      return SuccessResponse;
    } else {
      throw new Error("Unable to update invoice, Please check your data.");
    }
  } catch (err) {
    if (conn) {
      await conn.rollback();
    }

    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports.UpdateInvoiceItem = async (data) => {
  let conn;

  try {
    if (!data.id) {
      throw new Error("Required details missing.");
    }

    const allowedInvoiceItems = [
      "product_id",
      "quantity",
      "tax",
      "price",
      "discount",
      "subtotal",
    ];

    const chkFieldExist = allowedInvoiceItems.filter((field) => data[field]);

    if (chkFieldExist.length === 0) {
      throw new Error("Required details missing.");
    }

    const getAllowedFields = chkFieldExist.map((field) => data[field]);
    const sqlQry = chkFieldExist.map((field) => `${field} = ?`);

    const prepareSQL = `UPDATE invoice_items SET ${sqlQry} WHERE deleted = '0' AND id = ?`;

    conn = await dbConn.getConnection();
    await conn.beginTransaction();

    const [execQry] = await conn.execute(prepareSQL, [
      ...getAllowedFields,
      data.id,
    ]);

    if (execQry.affectedRows > 0) {
      const SuccessResponse = SuccessResp();
      SuccessResponse.message = "Invoice item updated successfully.";
      return SuccessResponse;
    } else {
      throw new Error("Unable to create invoice, Please check your data.");
    }
  } catch (err) {
    if (conn) {
      await conn.rollback();
    }

    const ErrorResponse = ErrorResp();
    ErrorResponse.error = err.message;
    return ErrorResponse;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
