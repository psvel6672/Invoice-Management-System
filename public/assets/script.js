const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const menuTexts = document.querySelectorAll(".menu-text");
const menuItems = document.querySelectorAll(".menu-item");
const sidebarTitle = document.getElementById("sidebarTitle");

menuBtn.addEventListener("click", () => {
  if (window.innerWidth < 768) {
    // Mobile → open sidebar
    sidebar.classList.remove("-translate-x-full");
  } else {
    // Desktop → collapse / expand
    sidebar.classList.toggle("w-20");
    sidebar.classList.toggle("w-64");

    menuTexts.forEach((el) => el.classList.toggle("hidden"));
    menuItems.forEach((item) => item.classList.toggle("justify-center"));

    const collapsed = sidebar.classList.contains("w-20");

    sidebarTitle.innerText = collapsed ? "PSINS" : "PS Invoice";

    // Save state
    localStorage.setItem("sidebarState", collapsed ? "collapsed" : "expanded");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth >= 768) {
    const sidebarState = localStorage.getItem("sidebarState");

    if (sidebarState === "collapsed") {
      sidebar.classList.remove("w-64");
      sidebar.classList.add("w-20");

      menuTexts.forEach((el) => el.classList.add("hidden"));
      menuItems.forEach((item) => item.classList.add("justify-center"));

      sidebarTitle.innerText = "PSINS";
    }
  }
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
});

window.addEventListener("resize", () => {
  if (window.innerWidth < 768) {
    sidebar.classList.remove("w-20");
    sidebar.classList.add("w-64");
    sidebar.classList.add("-translate-x-full");

    menuTexts.forEach((el) => el.classList.remove("hidden"));
    menuItems.forEach((item) => item.classList.remove("justify-center"));

    sidebarTitle.innerText = "PS Invoice";
  }
});

/* PROFILE DROPDOWN */

const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");

profileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  profileDropdown.classList.add("hidden");
});

// Data Table

function prepareDataTable(divid) {
  $(document).ready(function () {
    $(divid).DataTable({
      scrollY: "400px",
      scrollX: true,
      pageLength: 30,
      scrollCollapse: true,
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      lengthMenu: [
        [30, 40, 50],
        [30, 40, 50],
      ],
      language: {
        search: "",
        searchPlaceholder: "Search products...",
      },
    });
  });
}

// Products Page JS

const productspage = document.getElementById("productspage");
const productsPageTbody = document.getElementById("products_page_tbody");

async function getLoadProductsPage() {
  const getAllProducts = await fetch("/products/allproducts");
  const getProductsData = await getAllProducts.json();
  // console.log(getProductsData);

  const getData = getProductsData.data;

  let productsData = "";
  let autoId = 0;

  getData.forEach((rec) => {
    autoId += 1;

    productsData += `

    <tr class="hover:bg-slate-50">
      <td class="py-3 px-4 font-medium">${autoId}</td>
      <td class="py-3 px-4 font-medium">${rec.product_name}</td>
      <td class="py-3 px-4">${rec.product_desc}</td>
      <td class="py-3 px-4">₹${rec.product_price}</td>
      <td class="py-3 px-4">
        <button
          class="text-blue-600 hover:text-blue-800 mr-3" onclick="editProduct(${rec.product_id})"
        >
          <i class="fa fa-pen"></i>
        </button>

        <button
          class="text-red-600 hover:text-red-800"
          onclick="removeProduct(${rec.product_id})"
        >
          <i class="fa fa-trash"></i>
        </button>
      </td>
    </tr>
    
    `;
  });

  productsPageTbody.innerHTML = productsData;
  await prepareDataTable("#productsTable");
}

if (productspage) {
  getLoadProductsPage();
}

// Add productForm;

const productForm = document.getElementById("productForm");

if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(productForm);

    const data = [];

    formData.forEach((value, key) => {
      const cleanKey = key.replace("[]", "");

      if (!data[cleanKey]) {
        data[cleanKey] = [];
      }

      data[cleanKey].push(value);
    });

    const products = data.product_name.map((_, index) => ({
      product_name: data.product_name[index],
      product_desc: data.product_desc[index],
      product_price: data.product_price[index],
    }));

    const response = await fetch("/products/addproduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products),
    });

    const getResp = await response.json();

    if (getResp.code === 200) {
      alert(getResp.message);
      window.location = "/allproducts";
    } else {
      alert(getResp.message);
    }
  });
}

const addProductRowBtn = document.getElementById("addProductRowBtn");
const addProductTableBody = document.getElementById("addProductTableBody");

if (addProductRowBtn) {
  addProductRowBtn.addEventListener("click", () => {
    const row = document.createElement("tr");
    row.classList.add("product-row");

    row.innerHTML = `
<td class="px-4 py-3">
<input type="text" name="product_name[]" placeholder="Product Name"
class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
</td>

<td class="px-4 py-3">
<input type="text" name="product_desc[]" placeholder="Product Description"
class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
</td>

<td class="px-4 py-3">
<input type="number" name="product_price[]" placeholder="Price"
class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
</td>

<td class="px-4 py-3">
<button type="button" class="removeRow text-red-500 hover:text-red-700">
<i class="fa fa-trash"></i>
</button>
</td>
`;

    addProductTableBody.appendChild(row);
  });
}

const deleteProductModal = document.getElementById("deleteProductModal");
const confirmProductDelete = document.getElementById("confirmProductDelete");
const cancelProductDelete = document.getElementById("cancelProductDelete");

const deleteProductId = document.getElementById("deleteProductId");

/* OPEN DELETE MODAL */

function removeProduct(id) {
  deleteProductModal.classList.remove("hidden");
  deleteProductId.value = id;
}

/* CANCEL DELETE */

if (cancelProductDelete) {
  cancelProductDelete.addEventListener("click", () => {
    deleteProductModal.classList.add("hidden");
    deleteProductId.value = 0;
  });
}

/* CONFIRM DELETE */

if (confirmProductDelete) {
  confirmProductDelete.addEventListener("click", async (e) => {
    e.preventDefault();

    const getBody = {
      id: deleteProductId.value,
    };

    const getFetch = await fetch("/products/deleteproduct", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(getBody),
    });

    const getResp = await getFetch.json();
    alert(getResp.message);
    if (getResp.code === 200) {
      deleteProductModal.classList.add("hidden");
      window.location = "/allproducts";
    }
  });
}

let rowToEdit = null;

const editModal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editDescription = document.getElementById("editDescription");
const editPrice = document.getElementById("editPrice");
const editProductId = document.getElementById("editProductId");

const cancelEdit = document.getElementById("cancelEdit");
const editProductForm = document.getElementById("editProductForm");

/* OPEN EDIT MODAL */

async function editProduct(id) {
  const getProductDetails = await fetch("/products/getproductinfo", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ product_id: id }),
  });
  const getInfo = await getProductDetails.json();

  // console.log(getInfo)

  if (getInfo.code === 200) {
    for (const getProduct of getInfo.data) {
      editName.value = getProduct.product_name;
      editDescription.value = getProduct.product_desc;
      editPrice.value = getProduct.product_price;
      editProductId.value = getProduct.product_id;
    }

    editModal.classList.remove("hidden");
  } else {
    alert(getInfo.message);
  }
}

/* CANCEL EDIT */

if (cancelEdit) {
  cancelEdit.addEventListener("click", () => {
    editProductId.value = 0;
    editModal.classList.add("hidden");
  });
}

/* UPDATE PRODUCT */

if (editProductForm) {
  editProductForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const getBodyData = {
      id: editProductId.value,
      product_name: editName.value,
      product_desc: editDescription.value,
      product_price: editPrice.value,
    };

    const getFetch = await fetch("/products/updateproduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getBodyData),
    });
    const getResp = await getFetch.json();
    alert(getResp.message);
    if (getResp.code === 200) {
      window.location = "/allproducts";
    }
  });
}

// Customer Page JS

const customerspage = document.getElementById("customerspage");
const customersPageTbody = document.getElementById("customers_page_tbody");

async function getLoadCustomerPage() {
  const getAllCustomers = await fetch("/customers/allcustomers");
  const getCustomersData = await getAllCustomers.json();

  const getData = getCustomersData.data;
  // console.log(getData);

  let customersData = "";
  let autoId = 0;

  for (const rec of getData) {
    autoId += 1;

    customersData += `

    <tr class="hover:bg-slate-50">
      <td class="py-3 px-4 font-medium">${autoId}</td>
      <td class="py-3 px-4 font-medium">${rec.name}</td>
      <td class="py-3 px-4 font-medium">${rec.email}</td>
      <td class="py-3 px-4 font-medium">${rec.phone}</td>
      <td class="py-3 px-4 font-medium">${rec.town}</td>

      <td class="py-3 px-4">
        <button
          class="text-blue-600 hover:text-blue-800 mr-3" onclick="openCustEditModal(${rec.id})"
        >
          <i class="fa fa-pen"></i>
        </button>

        <button class="text-red-600 hover:text-red-800" onclick="openCustDeleteModal(${rec.id})">
          <i class="fa fa-trash"></i>
        </button>
      </td>
    </tr>
    
    `;
  }

  customersPageTbody.innerHTML = customersData;
  await prepareDataTable("#customersTable");
}

if (customerspage) {
  getLoadCustomerPage();
}

const customerForm = document.getElementById("customerForm");

if (customerForm) {
  customerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(customerForm);

    const data = [];

    formData.forEach((value, key) => {
      const cleanKey = key.replace("[]", "");

      if (!data[cleanKey]) {
        data[cleanKey] = [];
      }

      data[cleanKey].push(value);
    });

    const customers = data.name.map((_, index) => ({
      name: data.name[index],
      email: data.email[index],
      phone: data.phone[index],
      town: data.city[index],
    }));

    const response = await fetch("/customers/createcustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customers),
    });

    const getResp = await response.json();
    // console.log(getResp)
    alert(getResp.message);
    if (getResp.code === 200) {
      window.location = "/allcustomers";
    }
  });
}

const addCustomerRowBtn = document.getElementById("addCustomerRowBtn");
const customerTableBody = document.getElementById("customerTableBody");

if (addCustomerRowBtn) {
  addCustomerRowBtn.addEventListener("click", () => {
    const row = document.createElement("tr");
    row.classList.add("customer-row");

    row.innerHTML = `
            <td class="px-4 py-3">
              <input
                type="text"
                name="name[]"
                placeholder="Customer Name"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </td>

            <td class="px-4 py-3">
              <input
                type="text"
                name="email[]"
                placeholder="Email ID"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </td>

            <td class="px-4 py-3">
              <input
                type="number"
                name="phone[]"
                placeholder="eg:- 6728728788"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </td>

            <td class="px-4 py-3">
              <input
                type="text"
                name="city[]"
                placeholder="City"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </td>

            <td class="px-4 py-3">
              <button
                type="button"
                class="removeCustomerRow text-red-500 hover:text-red-700"
              >
                <i class="fa fa-trash"></i>
              </button>
            </td>`;

    customerTableBody.appendChild(row);
  });
}

document.addEventListener("click", function (e) {
  if (e.target.closest(".removeCustomerRow")) {
    const row = e.target.closest("tr");
    row.remove();
  }
});

let rowToDelete = null;
let rowToCustEdit = null;

const editCustModal = document.getElementById("editCustomerModal");

const editCustomerId = document.getElementById("editCustomerId");

const custName = document.getElementById("custName");
const custEmail = document.getElementById("custEmail");
const custPhone = document.getElementById("custPhone");
const custAddr1 = document.getElementById("custAddr1");
const custAddr2 = document.getElementById("custAddr2");
const custCity = document.getElementById("custCity");
const custCountry = document.getElementById("custCountry");
const custPincode = document.getElementById("custPincode");
const custShipName = document.getElementById("custShipName");
const custShipAddr1 = document.getElementById("custShipAddr1");
const custShipAddr2 = document.getElementById("custShipAddr2");
const custShipCity = document.getElementById("custShipCity");
const custShipCountry = document.getElementById("custShipCountry");
const custShipPincode = document.getElementById("custShipPincode");

const cancelCustEdit = document.getElementById("cancelCustEdit");

/* OPEN EDIT MODAL */

async function openCustEditModal(id) {
  const getFetch = await fetch("/customers/getcustomerinfo", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ customer_id: id }),
  });

  const getResp = await getFetch.json();
  // console.log(getResp);

  if (getResp.code === 200) {
    const getDataResp = getResp.data;
    // console.log(getDataResp)

    for (const getInfo of getDataResp) {
      custName.value = getInfo.name;
      custEmail.value = getInfo.email;
      custPhone.value = getInfo.phone;
      custAddr1.value = getInfo.address_1;
      custAddr2.value = getInfo.address_2;
      custCity.value = getInfo.town;
      custCountry.value = getInfo.country;
      custPincode.value = getInfo.postcode;
      custShipName.value = getInfo.name_ship;
      custShipAddr1.value = getInfo.address_1_ship;
      custShipAddr2.value = getInfo.address_2_ship;
      custShipCity.value = getInfo.town_ship;
      custShipCountry.value = getInfo.country_ship;
      custShipPincode.value = getInfo.postcode_ship;
      editCustomerId.value = getInfo.id;
    }

    editCustModal.classList.remove("hidden");
  } else {
    alert(getResp.message);
  }
}

const editCustomerForm = document.getElementById("editCustomerForm");

if (editCustomerForm) {
  const getCheckBoxSameAs = document.getElementById("same_as_cust_info");

  getCheckBoxSameAs.addEventListener("change", () => {
    if (getCheckBoxSameAs.checked) {
      custShipName.value = custName.value;
      custShipAddr1.value = custAddr1.value;
      custShipAddr2.value = custAddr2.value;
      custShipCity.value = custCity.value;
      custShipCountry.value = custCountry.value;
      custShipPincode.value = custPincode.value;
    } else {
      custShipName.value = "";
      custShipAddr1.value = "";
      custShipAddr2.value = "";
      custShipCity.value = "";
      custShipCountry.value = "";
      custShipPincode.value = "";
    }
  });

  editCustomerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const getCustomerBodyData = {
      id: editCustomerId.value,
      name: custName.value,
      email: custEmail.value,
      address_1: custAddr1.value,
      address_2: custAddr2.value,
      town: custCity.value,
      country: custCountry.value,
      postcode: custPincode.value,
      phone: custPhone.value,
    };

    const getFetch = await fetch("/customers/updatecustomerinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getCustomerBodyData),
    });

    const getResp = await getFetch.json();
    if (getResp.code === 200) {
      const getShippingBodyData = {
        name_ship: custShipName.value,
        address_1_ship: custShipAddr1.value,
        address_2_ship: custShipAddr2.value,
        town_ship: custShipCity.value,
        country_ship: custShipCountry.value,
        postcode_ship: custShipPincode.value,
      };

      const allowedFields = [
        "name_ship",
        "address_1_ship",
        "address_2_ship",
        "town_ship",
        "country_ship",
        "postcode_ship",
      ];

      const getCheckShipping = allowedFields.filter(
        (field) => getShippingBodyData[field],
      );

      if (getCheckShipping.length > 0) {
        
        getShippingBodyData.id = editCustomerId.value;

        const getShipFetch = await fetch("/customers/updateshippinginfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(getShippingBodyData),
        });

        const getShipResp = await getShipFetch.json();

        alert(getShipResp.message);

        if (getShipResp.code === 200) {
          window.location = "/allcustomers";
        }
      } else {
        alert(getResp.message);
        window.location = "/allcustomers";
      }
    } else {
      alert(getResp.message);
    }
  });
}

if (cancelCustEdit) {
  cancelCustEdit.addEventListener("click", () => {
    editCustModal.classList.add("hidden");
    rowToEdit = null;
  });
}

const deleteCustomerModal = document.getElementById("deleteCustomerModal");
const deleteCustomerId = document.getElementById("deleteCustomerId");

let rowToCustDelete = null;
const cancelCustomerDelete = document.getElementById("cancelCustomerDelete");
const confirmCustomerDelete = document.getElementById("confirmCustomerDelete");

function openCustDeleteModal(id) {
  deleteCustomerId.value = id;
  deleteCustomerModal.classList.remove("hidden");
}

/* CANCEL DELETE */

if (cancelCustomerDelete) {
  cancelCustomerDelete.addEventListener("click", () => {
    deleteCustomerId.value = 0;
    deleteCustomerModal.classList.add("hidden");
  });
}

/* CONFIRM DELETE */

if (confirmCustomerDelete) {
  confirmCustomerDelete.addEventListener("click", async (e) => {
    e.preventDefault();

    const getFetchDelete = await fetch("/customers/deletecustomer", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ customer_id: deleteCustomerId.value }),
    });

    const getDeleteResp = await getFetchDelete.json();

    alert(getDeleteResp.message);

    if (getDeleteResp.code === 200) {
      window.location = "/allcustomers";
    }

    deleteCustomerModal.classList.add("hidden");
  });
}

// System User Page JS

const sysuserPage = document.getElementById("sysuserPage");
const sysuserPageTbody = document.getElementById("sysusers_page_tbody");

async function getLoadSysUserPage() {
  const getAllSysUsers = await fetch("/users/allusers");
  const getSysUsersData = await getAllSysUsers.json();

  const getData = getSysUsersData.data;
  // console.log(getData);

  let sysUsersData = "";
  let autoId = 0;

  for (const rec of getData) {
    autoId += 1;

    sysUsersData += `

    <tr class="hover:bg-slate-50">
      <td class="py-3 px-4 font-medium">${autoId}</td>
      <td class="py-3 px-4 font-medium">${rec.name}</td>
      <td class="py-3 px-4 font-medium">${rec.username}</td>
      <td class="py-3 px-4 font-medium">${rec.email}</td>
      <td class="py-3 px-4 font-medium">${rec.phone}</td>

      <td class="py-3 px-4">
        <button
          class="text-blue-600 hover:text-blue-800 mr-3" onclick="openSysUserEditModal(${rec.id})"
        >
          <i class="fa fa-pen"></i>
        </button>

        <button
          class="text-red-600 hover:text-red-800"
          onclick="openSysUserDeleteModal(${rec.id})"
        >
          <i class="fa fa-trash"></i>
        </button>
      </td>
    </tr>
    
    `;
  }

  sysuserPageTbody.innerHTML = sysUsersData;
  await prepareDataTable("#sysusersTable");
}

if (sysuserPage) {
  getLoadSysUserPage();
}

const addUserRowBtn = document.getElementById("addUserRowBtn");
const addUsersTableBody = document.getElementById("addUsersTableBody");

if (addUserRowBtn) {
  addUserRowBtn.addEventListener("click", () => {
    const row = document.createElement("tr");
    row.classList.add("users-row");

    row.innerHTML = `
            <td class="px-4 py-3">
              <input
                type="text"
                name="name[]"
                placeholder="Name"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </td>
            
            <td class="px-4 py-3">
              <input
                type="text"
                name="username[]"
                placeholder="Username"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </td>

            <td class="px-4 py-3">
              <input
                type="text"
                name="email[]"
                placeholder="Email ID"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </td>

            <td class="px-4 py-3">
              <input
                type="number"
                name="phone[]"
                placeholder="eg:- 6728728788"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </td>

            <td class="px-4 py-3">
              <input
                type="password"
                name="password[]"
                placeholder="Password"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </td>

            <td class="px-4 py-3">
              <button
                type="button"
                class="removeUserRow text-red-500 hover:text-red-700"
              >
                <i class="fa fa-trash"></i>
              </button>
            </td>`;

    addUsersTableBody.appendChild(row);
  });
}

document.addEventListener("click", function (e) {
  if (e.target.closest(".removeUserRow")) {
    const row = e.target.closest("tr");
    row.remove();
  }
});

const usersForm = document.getElementById("usersForm");

if (usersForm) {
  usersForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(usersForm);

    const data = [];

    formData.forEach((value, key) => {
      const cleanKey = key.replace("[]", "");

      if (!data[cleanKey]) {
        data[cleanKey] = [];
      }

      data[cleanKey].push(value);
    });

    const users = data.name.map((_, index) => ({
      name: data.name[index],
      username: data.username[index],
      email: data.email[index],
      phone: data.phone[index],
      password: data.password[index],
    }));

    const response = await fetch("/users/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    });

    const getResp = await response.json();
    // console.log(getResp)
    alert(getResp.message);
    if (getResp.code === 200) {
      window.location = "/allsysusers";
    }
  });
}

const editSysUserModal = document.getElementById("editSysUserModal");
const editSysUserForm = document.getElementById("editSysUserForm");

const editNameUser = document.getElementById("editNameUser");
const editUserName = document.getElementById("editUserName");
const editUserEmail = document.getElementById("editUserEmail");
const editUserPhone = document.getElementById("editUserPhone");
const editUserId = document.getElementById("editUserId");

const cancelSysUserEdit = document.getElementById("cancelSysUserEdit");

async function openSysUserEditModal(id) {

  const getUserInfo = await fetch("/users/getuserdetails", {
    method: "POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify({user_id: id})
  })

  const getJSONResp = await getUserInfo.json();

  if(getJSONResp.code !== 200){
    alert(getJSONResp.message);
    return;
  }

  const getData = getJSONResp.data[0];

  editNameUser.value = getData.name;
  editUserName.value = getData.username;
  editUserEmail.value = getData.email;
  editUserPhone.value = getData.phone;
  editUserId.value = getData.id;

  editSysUserModal.classList.remove('hidden');

}

if(cancelSysUserEdit){
  cancelSysUserEdit.addEventListener("click", () => {

    editNameUser.value = "";
    editUserName.value = "";
    editUserEmail.value = "";
    editUserPhone.value = "";
    editUserId.value = "";

    editSysUserModal.classList.add('hidden');

  })
}

if(editSysUserForm){
  editSysUserForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const getPrepareBody = {

      name: editNameUser.value,
      username: editUserName.value,
      email: editUserEmail.value,
      phone: editUserPhone.value,
      id: editUserId.value,

    }

    const updateUserInfo = await fetch("/users/updateuserdetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(getPrepareBody)
    });

    const getJSONResp = await updateUserInfo.json();

    alert(getJSONResp.message)

    if(getJSONResp.code === 200){

      window.location = '/allsysusers';
      
    }

  });
}

const deleteSysUserModal = document.getElementById('deleteSysUserModal')
const deleteSysUserId = document.getElementById("deleteSysUserId")

const cancelSysUserDelete = document.getElementById("cancelSysUserDelete");
const confirmSysUserDelete = document.getElementById("confirmSysUserDelete");

function openSysUserDeleteModal(id){

  deleteSysUserId.value = id;
  deleteSysUserModal.classList.remove("hidden")

}

if(cancelSysUserDelete){

  cancelSysUserDelete.addEventListener("click", () => {

    deleteSysUserId.value = "";
    deleteSysUserModal.classList.add("hidden")

  });

}

if(confirmSysUserDelete){

  confirmSysUserDelete.addEventListener("click", async (e) => {

    e.preventDefault();

    const userId = deleteSysUserId.value;

    const getDeleteInfo = await fetch("/users/deleteuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({user_id: userId})
    });

    const getJSONResp = await getDeleteInfo.json();

    alert(getJSONResp.message);

    if(getJSONResp.code === 200){
      window.location = '/allsysusers'
    }

  })
  
}

// System User Page JS

const invoicePage = document.getElementById("invoicePage");
const invoicePageTbody = document.getElementById("invoice_page_tbody");

async function getLoadInvoicePage() {
  const getAllInvoice = await fetch("/invoice/allinvoices");
  const getInvoiceData = await getAllInvoice.json();

  const getData = getInvoiceData.data;
  console.log(getData);

  let invoiceData = "";
  let autoId = 0;

  for (const rec of getData) {
    autoId += 1;

    invoiceData += `

    <tr class="hover:bg-slate-50">
        <td class="py-3 px-4 font-medium">${autoId}</td>
        <td class="py-3 px-4 font-medium">${rec.invoice_date}</td>
        <td class="py-3 px-4">
          ${rec.invoice_no}
        </td>
        <td class="py-3 px-4">${rec.customer_id || "-"}</td>
        <td class="py-3 px-4">${rec.invoice_type}</td>
        <td class="py-3 px-4">₹${rec.total}</td>
        <td class="py-3 px-4"> <span class="${(rec.status).toLowerCase() === "paid" ? "bg-green-500" : "bg-red-500" } px-3 py-1 text-white rounded-xl">${rec.status}</span></td>
        <td class="py-3 px-4">
          <button
            class="editRow text-blue-600 hover:text-blue-800 mr-3"
          >
            <i class="fa fa-pen"></i>
          </button>

          <button
            class="text-red-600 hover:text-red-800"
            onclick="removeInvoiceRow('${rec.invoice_no}')"
          >
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    
    `;
  }

  invoicePageTbody.innerHTML = invoiceData;
  await prepareDataTable("#invoiceTable");
}

if (invoicePage) {
  getLoadInvoicePage();
}

const addInvoicePage = document.getElementById("addInvoicePage");


const custInfoName = document.getElementById("custInfoName");
const custInfoId = document.getElementById("custInfoId");

const custInvoiceMobile = document.getElementById("custInvoiceMobile");
const custInvoiceEmail = document.getElementById("custInvoiceEmail");
const custInvoiceAddress = document.getElementById("custInvoiceAddress");
const custInvoiceCity = document.getElementById("custInvoiceCity");
const custInvoiceState = document.getElementById("custInvoiceState");
const custInvoicePin = document.getElementById("custInvoicePin");

const invoiceCustInfoCheckbox = document.getElementById("invoiceCustInfoCheckbox");

const custInvoiceShippingName = document.getElementById("custInvoiceShippingName");
const custInvoiceShippingMobile = document.getElementById("custInvoiceShippingMobile");
const custInvoiceShippingEmail = document.getElementById("custInvoiceShippingEmail");
const custInvoiceShippingAddress = document.getElementById("custInvoiceShippingAddress");
const custInvoiceShippingCity = document.getElementById("custInvoiceShippingCity");
const custInvoiceShippingState = document.getElementById("custInvoiceShippingState");
const custInvoiceShippingPin = document.getElementById("custInvoiceShippingPin");


const invoiceProductName = document.querySelectorAll(".invoiceProductName");
const invoiceProductDesc = document.querySelectorAll(".invoiceProductDesc");
const invoiceProductQuantity = document.querySelectorAll(".invoiceProductQuantity");
const invoiceProductPrice = document.querySelectorAll(".invoiceProductPrice");
const invoiceProductDiscount = document.querySelectorAll(".invoiceProductDiscount");
const invoiceProductTax = document.querySelectorAll(".invoiceProductTax");
const invoiceProductSubTotal = document.querySelectorAll(".invoiceProductSubTotal");

const makeReadOnlyProductInvoice = ["invoiceProductDesc", "invoiceProductPrice", "invoiceProductDiscount", "invoiceProductTax", "invoiceProductSubTotal"];

async function loadCustomers(divId){

  const getAllCustomers = await fetch("/customers/allcustomers");
  const getJSONResp = await getAllCustomers.json();

  let custDD = "";

  for(const cust of getJSONResp.data){
    custDD += `<li onclick="populateCustomerInfo(${cust.id}, this)">${cust.name}</li>`;
  }

  document.getElementById(String(divId)).innerHTML = custDD;

}

async function populateCustomerInfo(custId, el){

  const getCustomerInfo = await fetch("/customers/getcustomerinfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({customer_id: custId})
  })

  const getJSONResp = await getCustomerInfo.json();
  const getData = getJSONResp.data[0];

  if(getJSONResp.code !== 200){
    alert(getJSONResp.message);
    return;
  }

  custInfoId.value = getData.id;
  custInvoiceMobile.value = getData.phone;
  custInvoiceEmail.value = getData.email;
  custInvoiceAddress.value = `${getData.address_1}, ${getData.address_2}`;
  custInvoiceCity.value = getData.town;
  custInvoiceState.value = getData.town;
  custInvoicePin.value = getData.postcode;

  selectOption(el);

  // custInfoId

}

if(invoiceCustInfoCheckbox){
  invoiceCustInfoCheckbox.addEventListener("change", (e) => {

    e.preventDefault();

    if(invoiceCustInfoCheckbox.checked){

      custInvoiceShippingName.value = custInfoName.value;
      custInvoiceShippingMobile.value = custInvoiceMobile.value;
      custInvoiceShippingEmail.value = custInvoiceEmail.value;
      custInvoiceShippingAddress.value = custInvoiceAddress.value;
      custInvoiceShippingCity.value = custInvoiceCity.value;
      custInvoiceShippingState.value = custInvoiceState.value;
      custInvoiceShippingPin.value = custInvoicePin.value;

    }else{

      custInvoiceShippingName.value = "";
      custInvoiceShippingMobile.value = "";
      custInvoiceShippingEmail.value = "";
      custInvoiceShippingAddress.value = "";
      custInvoiceShippingCity.value = "";
      custInvoiceShippingState.value = "";
      custInvoiceShippingPin.value = "";

    }

  })
}

async function loadProducts(divId){

  const getAllProducts = await fetch("/products/allproducts");
  const getJSONResp = await getAllProducts.json();

  let productDD = "";

  for(const product of getJSONResp.data){
    productDD += `<li onclick="populateProductInfo(${product.product_id}, this)">${product.product_name}</li>`;
  }

  document.getElementById(String(divId)).innerHTML = productDD;

  const makeReadOnlyProductInvoice = ["invoiceProductDesc", "invoiceProductPrice", "invoiceProductDiscount", "invoiceProductTax", "invoiceProductSubTotal"];

  for(const getProduct of makeReadOnlyProductInvoice){

    const getInvoiceField = document.querySelectorAll(`.${getProduct}`);
    getInvoiceField.forEach((field) => field.readOnly = true)

  }

}

async function populateProductInfo(prodId, el){

  const getProductInfo = await fetch("/products/getproductinfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({product_id: prodId})
  })

  const getJSONResp = await getProductInfo.json();
  const getProductData = getJSONResp.data[0];

  const getClosestTr = el.closest('tr');
  getClosestTr.querySelector(".invoiceProductDesc").value = getProductData.product_desc
  getClosestTr.querySelector(".invoiceProductPrice").value = getProductData.product_price
  getClosestTr.querySelector(".invoiceProductName").value = getProductData.product_name
  getClosestTr.querySelector(".invoiceProductId").value = getProductData.product_id
  getClosestTr.querySelector(".invoiceProductDiscount").value = getProductData.discount
  getClosestTr.querySelector(".invoiceProductTax").value = getProductData.tax

  selectOption(el);
}

const invoice_date = document.getElementById("invoice_date");
const invoice_due_date = document.getElementById("invoice_due_date");

async function getLoadAddInvoicePage(){

  const [ _, __, ___ ] = await Promise.allSettled([loadCustomers("invoiceCustomerDD"), loadCustomers("invoiceShippingDD"), loadProducts("invoiceProductsDD")]);

  const getDate = new Date().toLocaleDateString();
  const alignDate = getDate.split("/").reverse().join("-");

  invoice_date.value = alignDate;
  invoice_due_date.value = alignDate;

}

if(addInvoicePage){
  getLoadAddInvoicePage();
}

// function addInvoiceProductRow(){

function addInvoiceProductRow() {

  const getTime = new Date().getTime();

  const row = `
    <tr>
      <td class="px-4 py-3">
        <div class="searchSelect">
          <div
            class="selectDisplay"
            onclick="toggleDropdown(this)"
          >
            Select Product
          </div>

          <div class="selectDropdown">
            <input
              type="text"
              class="dropdownSearch"
              placeholder="Search customer..."
              onkeyup="filterDropdown(this)"
            />

            <ul class="dropdownList" id="invoiceProductsDD-${getTime}">
            </ul>
          </div>

          <input type="hidden" name="customer" class="invoiceProductName" />
          <input type="hidden" name="customer" class="invoiceProductId" />
        </div>
      </td>

      <td class="px-4 py-3">
        <input
          type="text"
          name="description[]"
          placeholder="Description"
          class="invoiceProductDesc w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </td>

      <td class="px-4 py-3">
        <input
          type="number"
          name="quantity[]"
          placeholder="Quantity"
          class="invoiceProductQuantity w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </td>

      <td class="px-4 py-3">
        <input
          type="number"
          name="price[]"
          placeholder="Price"
          class="invoiceProductPrice w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </td>
      <td class="px-4 py-3">
        <input
          type="number"
          name="discount[]"
          placeholder="Discount"
          class="invoiceProductDiscount w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </td>
      <td class="px-4 py-3">
        <input
          type="number"
          name="tax[]"
          placeholder="Tax"
          class="invoiceProductTax w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </td>
      <td class="px-4 py-3">
        <input
          type="number"
          name="subtotal[]"
          placeholder="Sub Total"
          class="invoiceProductSubTotal w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </td>

      <td class="px-4 py-3">
        <button
          type="button"
          class="removeInvoiceProductRow text-red-500 hover:text-red-700"
        >
          <i class="fa fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
  document.getElementById("invoiceItems").insertAdjacentHTML("beforeend", row);

  loadProducts(`invoiceProductsDD-${getTime}`)
  makeQunatityCalculate();

}

function makeQunatityCalculate() {

  const invoiceProductQuantity = document.querySelectorAll(".invoiceProductQuantity");

  invoiceProductQuantity.forEach((quantity) => {

    quantity.addEventListener('input', (e) => {

      const getQuantity = Number(e.target.value) || 0;
      const getTr = e.target.closest('tr');
      const getPrPrice = Number(getTr.querySelector(".invoiceProductPrice").value);
      const getTax = Number(getTr.querySelector(".invoiceProductTax").value);
      const getDiscount = Number(getTr.querySelector(".invoiceProductDiscount").value);
      const getSubtotal = getTr.querySelector(".invoiceProductSubTotal");

      // console.log(getSubtotal)

      const getProductSubTotal = (Number(getQuantity) * Number(getPrPrice));

      const calcTax = ((getProductSubTotal * Number(getTax))/100)
      const calcDiscount = ((getProductSubTotal * Number(getDiscount))/100)

      const subTotalVal = getProductSubTotal + calcTax - calcDiscount;
      getSubtotal.value = subTotalVal.toFixed(2);

      calculateTotal();

    })

  })
}

if(invoiceProductQuantity){
  makeQunatityCalculate(); 
}

const invoiceShippingCharges = document.getElementById("invoiceShippingCharges");

if(invoiceShippingCharges){

  invoiceShippingCharges.addEventListener('input', (e) => {

    const getShipping = Number(e.target.value) || 0;
    const getGrandTotal = document.getElementById("grandTotal")
    const subtotal = document.getElementById("subtotal")

    getGrandTotal.innerText = Number(Number(subtotal.innerText) + getShipping).toFixed(2)

  });

}

const getRemoveTaxInvoice = document.getElementById("removeTaxInvoice");

if(getRemoveTaxInvoice){

  getRemoveTaxInvoice.addEventListener("change", () => {

    const invoiceProductTax = document.querySelectorAll(".invoiceProductTax");

    if(getRemoveTaxInvoice.checked){

      const getTax = document.getElementById("invoiceTax");
      const getGrandTotal = document.getElementById("grandTotal")
      const subtotal = document.getElementById("subtotal")

      const taxedAmount = getTax.innerText;
      getTax.innerText = 0.00;
      subtotal.innerText = Number(subtotal.innerText) - taxedAmount;

      let grandFinal = subtotal.innerText;

      if(invoiceShippingCharges.value){
        grandFinal = Number(subtotal.innerText) + Number(invoiceShippingCharges.value)
      }

      getGrandTotal.innerText = Number(grandFinal).toFixed(2)

    }else{
      calculateTotal();
    }

  })

}

function calculateTotal() {
  
  const invoiceProductSubTotal = document.querySelectorAll(".invoiceProductSubTotal")
  const invoiceProductDiscount = document.querySelectorAll(".invoiceProductDiscount")
  const invoiceProductTax = document.querySelectorAll(".invoiceProductTax")

  let getSubTotal = [...invoiceProductSubTotal].reduce((sum, val) => sum + (Number(val.value) || 0), 0);

  let getDiscount = 0;

  invoiceProductDiscount.forEach((disc) => {
    const getTr = disc.closest("tr");
    const getRowPrice = getTr.querySelector(".invoiceProductPrice").value;
    getDiscount += ((Number(getRowPrice) * Number(disc.value))/100);
  })
  
  let getTax = 0;

  invoiceProductTax.forEach((tax) => {
    const getTr = tax.closest("tr");
    const getRowPrice = getTr.querySelector(".invoiceProductPrice").value;
    getTax += ((Number(getRowPrice) * Number(tax.value))/100);
  })

  document.getElementById("subtotal").innerText = getSubTotal.toFixed(2);
  document.getElementById("discount").innerText = getDiscount.toFixed(2);
  document.getElementById("invoiceTax").innerText = getTax.toFixed(2);

  const getShippingInfo = document.getElementById("invoiceShippingCharges");

  if(getShippingInfo.value){
    getSubTotal += Number(getShippingInfo.value);
  }

  document.getElementById("grandTotal").innerText = getSubTotal.toFixed(2);
}

document.addEventListener("click", function (e) {
  if (e.target.closest(".removeInvoiceProductRow")) {
    const row = e.target.closest("tr");
    row.remove();
    calculateTotal();
  }
});

const confirmSaveInvoiceModal = document.getElementById("confirmSaveInvoiceModal")
const confirmSaveInvoice = document.getElementById("confirmSaveInvoice")
const cancelInvoiceModal = document.getElementById("cancelInvoiceModal")

function openSaveInvoiceModal(){
  confirmSaveInvoiceModal.classList.remove("hidden")
}

if(cancelInvoiceModal){
  cancelInvoiceModal.addEventListener('click', () => {
    confirmSaveInvoiceModal.classList.add("hidden");
  })
}

if(confirmSaveInvoice){
  confirmSaveInvoice.addEventListener('click', async (e) => {

    e.preventDefault();

    const invoice_date = document.getElementById("invoice_date");
    const invoice_due_date = document.getElementById("invoice_due_date");
    const invoice_type = document.getElementById("invoice_type");
    const invoice_pay_status = document.getElementById("invoice_pay_status");
    const invoice_paid_via = document.getElementById("invoice_paid_via");

    const custInfoName = document.getElementById("custInfoName");
    const custInfoId = document.getElementById("custInfoId");
    const custInvoiceMobile = document.getElementById("custInvoiceMobile");
    const custInvoiceEmail = document.getElementById("custInvoiceEmail");
    const custInvoiceAddress = document.getElementById("custInvoiceAddress");
    const custInvoiceCity = document.getElementById("custInvoiceCity");
    const custInvoiceState = document.getElementById("custInvoiceState");
    const custInvoicePin = document.getElementById("custInvoicePin");

    const custInvoiceShippingName = document.getElementById("custInvoiceShippingName");
    const custInvoiceShippingMobile = document.getElementById("custInvoiceShippingMobile");
    const custInvoiceShippingEmail = document.getElementById("custInvoiceShippingEmail");
    const custInvoiceShippingAddress = document.getElementById("custInvoiceShippingAddress");
    const custInvoiceShippingCity = document.getElementById("custInvoiceShippingCity");
    const custInvoiceShippingState = document.getElementById("custInvoiceShippingState");
    const custInvoiceShippingPin = document.getElementById("custInvoiceShippingPin");

    const getinvoiceItems = document.getElementById("invoiceItems");
    const getinvoiceItemsTr = getinvoiceItems.querySelectorAll("tr");

    const data = [];

    getinvoiceItemsTr.forEach((invoiceitem) => {

      const getProductId = invoiceitem.querySelector(".invoiceProductId");
      const invoiceProductQuantity = invoiceitem.querySelector(".invoiceProductQuantity");
      const invoiceProductPrice = invoiceitem.querySelector(".invoiceProductPrice");
      const invoiceProductDiscount = invoiceitem.querySelector(".invoiceProductDiscount");
      const invoiceProductTax = invoiceitem.querySelector(".invoiceProductTax");
      const invoiceProductSubTotal = invoiceitem.querySelector(".invoiceProductSubTotal");

      data.push({

        product_id: getProductId.value,
        quantity: invoiceProductQuantity.value,
        price: invoiceProductPrice.value,
        discount: invoiceProductDiscount.value,
        tax: invoiceProductTax.value,
        subtotal: invoiceProductSubTotal.value,

      })

    });

    const invoiceRemarks = document.getElementById("invoiceRemarks");
    const invoiceCustomEmail = document.getElementById("invoiceCustomEmail");

    const subtotal = document.getElementById("subtotal");
    const discount = document.getElementById("discount");
    const invoiceShippingCharges = document.getElementById("invoiceShippingCharges");
    const invoiceTax = document.getElementById("invoiceTax");
    const grandTotal = document.getElementById("grandTotal");

    if(!custInfoName.value || !custInvoiceShippingName.value){
      confirmSaveInvoiceModal.classList.add("hidden");
      alert("Please add customer info.");
      return;
    }

    if(Number(grandTotal.innerText) <= 0){
      confirmSaveInvoiceModal.classList.add("hidden");
      alert("Please add items to invoice.");
      return;
    }

    const prepareBody = {

      invoice_date : invoice_date.value,
      invoice_due_date : invoice_due_date.value,
      invoice_type : invoice_type.value,
      status : invoice_pay_status.value,
      paid_via : invoice_paid_via.value,
      customer_info: {
        custInfoName: custInfoName.value,
        custInfoId: custInfoId.value,
        custInvoiceMobile: custInvoiceMobile.value,
        custInvoiceEmail: custInvoiceEmail.value,
        custInvoiceAddress: custInvoiceAddress.value,
        custInvoiceCity: custInvoiceCity.value,
        custInvoiceState: custInvoiceState.value,
        custInvoicePin: custInvoicePin.value,
      },
      shipping_info:{
        custInvoiceShippingName: custInvoiceShippingName.value,
        custInvoiceShippingMobile: custInvoiceShippingMobile.value,
        custInvoiceShippingEmail: custInvoiceShippingEmail.value,
        custInvoiceShippingAddress: custInvoiceShippingAddress.value,
        custInvoiceShippingCity: custInvoiceShippingCity.value,
        custInvoiceShippingState: custInvoiceShippingState.value,
        custInvoiceShippingPin: custInvoiceShippingPin.value,
      },
      invoice_product_info: [...data],
      notes:invoiceRemarks.value,
      custom_email:invoiceCustomEmail.value,
      subtotal : subtotal.innerText,
      discount : discount.innerText,
      shipping : Number(invoiceShippingCharges.value) || 0,
      tax : invoiceTax.innerText,
      total : grandTotal.innerText,

    }

    const getSaveInvoice = await fetch("/invoice/addinvoice", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(prepareBody)
    })

    const getJSONResp = await getSaveInvoice.json();
    alert(getJSONResp.message);

    if(getJSONResp.code === 200){
      window.location = "/allinvoices"
    }
    
  });

}

const deleteInvoiceModal = document.getElementById("deleteInvoiceModal");
const deleteInvoiceID = document.getElementById("deleteInvoiceID");
const cancelInvoiceDelete = document.getElementById("cancelInvoiceDelete");
const confirmInvoiceDelete = document.getElementById("confirmInvoiceDelete");

function removeInvoiceRow(id){
  deleteInvoiceModal.classList.remove('hidden');
  deleteInvoiceID.value = id;
}

if(cancelInvoiceDelete){
  cancelInvoiceDelete.addEventListener('click', () => {
    deleteInvoiceModal.classList.add('hidden');
    deleteInvoiceID.value = "";
  });
}

if(confirmInvoiceDelete){
  confirmInvoiceDelete.addEventListener('click', async (e) => {

    e.preventDefault();

    const getDeleteInvoice = await fetch("/invoice/deleteinvoice", {
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({invoive_no: deleteInvoiceID.value})
    });

    const getJSONResp = await getDeleteInvoice.json();
    alert(getJSONResp.message);
    if(getJSONResp.code === 200){
      window.location = "/allinvoices";
    }

  });
}

function toggleDropdown(el) {
  const dropdown = el.nextElementSibling;

  document.querySelectorAll(".selectDropdown").forEach((d) => {
    if (d !== dropdown) d.style.display = "none";
  });

  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

function selectOption(el) {
  const wrapper = el.closest(".searchSelect");
  wrapper.querySelector(".selectDisplay").innerText = el.innerText;
  wrapper.querySelector("input[type=hidden]").value = el.innerText;
  wrapper.querySelector(".selectDropdown").style.display = "none";
}

function filterDropdown(input) {
  const filter = input.value.toLowerCase();

  const items = input.closest(".selectDropdown").querySelectorAll("li");

  items.forEach((item) => {
    item.style.display = item.innerText.toLowerCase().includes(filter)
      ? "block"
      : "none";
  });
}

document.addEventListener("click", function (e) {
  if (!e.target.closest(".searchSelect")) {
    document
      .querySelectorAll(".selectDropdown")
      .forEach((d) => (d.style.display = "none"));
  }
});

setTimeout(() => {
  const classListForInput = [
    "border",
    "border-slate-200",
    "rounded-lg",
    "px-3",
    "py-2",
    "focus:ring-2",
    "focus:ring-blue-500",
    "outline-none",
    "mr-4",
  ];
  const filter = document.querySelector(".dataTables_filter input");
  if (filter) {
    classListForInput.forEach((el) => {
      filter.classList.add(el);
    });
  }
}, 100);

const dashboard = document.getElementById("dashbaordpage");
const total_products = document.getElementById("total_products");
const total_customers = document.getElementById("total_customers");
const total_invoice = document.getElementById("total_invoice");
const total_sales = document.getElementById("total_sales");
const pending_bills = document.getElementById("pending_bills");
const paid_bills = document.getElementById("paid_bills");
const due_amount = document.getElementById("due_amount");
const recentProductsTbody = document.getElementById("recent_products_tbody");
const recentCustomersTbody = document.getElementById("recent_customers_tbody");

async function getLoadDashboard() {
  const getDashboardData = await fetch("/index/dashboard");
  const getData = await getDashboardData.json();

  total_products.innerText = getData.data.total_products;
  total_customers.innerText = getData.data.total_customers;
  total_invoice.innerText = getData.data.total_invoice;
  total_sales.innerText = `₹${getData.data.total_sales}`;
  pending_bills.innerText = getData.data.pending_bills;
  paid_bills.innerText = getData.data.paid_bills;
  due_amount.innerText = getData.data.due_amount;

  const getRecentProducts = getData.data.recent_products;
  const getRecentCustomers = getData.data.recent_customers;

  let getRecentProductsHTML = "";
  let getRecentCustomersHTML = "";

  getRecentProducts.forEach((rec) => {
    getRecentProductsHTML += `

    <tr class="hover:bg-slate-50">
      <td class="py-3 px-4 font-medium">${rec.product_name}</td>
      <td class="py-3 px-4">${rec.product_desc}</td>
      <td class="py-3 px-4">₹${rec.product_price}</td>
    </tr>
    `;
  });

  recentProductsTbody.innerHTML = getRecentProductsHTML;

  getRecentCustomers.forEach((rec) => {
    getRecentCustomersHTML += `
    <tr class="hover:bg-slate-50">
      <td class="py-3 px-4 font-medium">${rec.name}</td>
      <td class="py-3 px-4">${rec.phone}</td>
      <td class="py-3 px-4">${rec.email}</td>
      <td class="py-3 px-4">${rec.town}</td>
    </tr>
    `;
  });

  recentCustomersTbody.innerHTML = getRecentCustomersHTML;
}

if (dashboard) {
  getLoadDashboard();
}


function openLogoutModal() {
  const getBody = document.querySelector('body');

  getBody.insertAdjacentHTML('beforeend', `
    <div
      id="logoutSystemModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center hidden z-50"
    >
      <div class="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6">
        <div class="flex items-center gap-3 mb-4">
          <i class="fa fa-triangle-exclamation text-red-500 text-2xl"></i>

          <h3 class="text-lg font-semibold text-slate-700">Confirm Logout</h3>
        </div>

        <p class="text-sm text-slate-500 mb-6">
          Are you sure you want to logout?
        </p>

        <input type="hidden" id="deleteInvoiceID">

        <div class="flex justify-end gap-3">
          <button
            id="cancelLogout"
            class="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-sm"
          >
            Cancel
          </button>

          <button
            id="confirmLogout"
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  `);

  const getLogoutModal = document.getElementById("logoutSystemModal");
  getLogoutModal.classList.remove('hidden');

  // Optional: close modal on cancel
  const cancelBtn = document.getElementById("cancelLogout");
  cancelBtn.addEventListener("click", () => {
    getLogoutModal.remove(); // removes modal from DOM
  });

  // Optional: handle logout
  const confirmBtn = document.getElementById("confirmLogout");
  confirmBtn.addEventListener("click", async () => {

    const logoutSystem = await fetch('/users/logout');
    const getJSONResp = await logoutSystem.json();

    if(getJSONResp.code === 200){
      window.location = '/login'
    };

    getLogoutModal.remove(); // removes modal from DOM

  });
}