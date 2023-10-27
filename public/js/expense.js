


 async function CreateExpense(event){
    event.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const catagory = document.getElementById('catagory').value;
    console.log(amount,description,catagory);

    const expense_data ={
        amount,description,catagory
    }
    console.log(expense_data)
    const token = localStorage.getItem('token'); 
    try{
        const response =await axios.post('http://localhost:3000/expenses',expense_data,{
                headers: { Authorization: token}})
            console.log(response);
            window.location.href="/expenses"
    }
    catch(err){
        console.log(err);
    }
            
            
            
}


window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.get('http://localhost:3000/expense',{
        headers: { Authorization: token }
    }); 
    console.log(response.data);

    for (let i = 0; i < response.data.length; i++) {
      showUserDetails(response.data[i]);
    }
  } catch (error) {
    console.error(error);
  }
});

function showUserDetails(expenses) {
  const expense_div = document.querySelector('.expenses');
  var userDetailsContainer = document.createElement("div");
  userDetailsContainer.className = 'expense_list';
  userDetailsContainer.setAttribute("data-id", expenses.id);
  userDetailsContainer.innerHTML = `<p>₹${expenses.amount} -  ${expenses.description} - ${expenses.catagory}</p>`;

  var deletebtn = document.createElement("button");
  deletebtn.id="expensedelete";
  deletebtn.className="btn btn-danger btn-sm"
  deletebtn.type = "submit"
  deletebtn.textContent = 'Delete'

  deletebtn.onclick = async  () => {
    try{
      const token = localStorage.getItem('token');
     const response= await axios.delete(`http://localhost:3000/expenses/${expenses.id}`, {
          headers: {
              Authorization: token
          }
      
      })
      alert(response.data.message);
      window.location.href='/expenses'
    }
    catch(err){
      console.log(err)
    }
  }



  userDetailsContainer.appendChild(deletebtn);
  expense_div.appendChild(userDetailsContainer);
}

const premium_btn = document.getElementById('razorpay');
premium_btn.onclick=async(e)=>{
  const token = localStorage.getItem('token');
  const response= await axios.get('http://localhost:3000/purchase/premium_membership',{ headers: { Authorization: token } })

  var options = {
    key: response.data.key_id,
    order_id: response.data.order_id,

    handler: async function (response) {
      console.log('Payment success. Payment ID:', response.razorpay_payment_id);
      try {
        await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        }, {
          headers: {
            "Authorization": token
          }
        });
        console.log('Payment status updated.');
        alert('You are a Premium User Now ');
      } catch (error) {
        console.error('Payment status update failed:', error);
        alert("Something went Wrong");
      }
    }
    
  }
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("Payment Failed", function (response) {
    console.log(response);
    alert("Something went Wrong");
  });

}
