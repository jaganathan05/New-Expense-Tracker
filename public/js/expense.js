
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
    const Premium_user = document.getElementById('premiumsuccessful');
    const premium_btn = document.getElementById('razorpay');
    const Leaderboardbtn = document.getElementById('leaderboardbtn');
    const response = await axios.get('http://localhost:3000/expense',{
        headers: { Authorization: token }
    }); 
    console.log(response.data.message);
    var premium_user_check = response.data.message;
    if (premium_user_check==="SUCCESSFULL"){
      Premium_user.style.display='block';
      premium_btn.style.display='none';
      Leaderboardbtn.style.display='block';
    }

    for (let i = 0; i < response.data.result.length; i++) {
      showUserDetails(response.data.result[i]);
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

const Premium_user = document.getElementById('premiumsuccessful');
const premium_btn = document.getElementById('razorpay');
const Leaderboardbtn = document.getElementById('leaderboardbtn');
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
        premium_btn.style.display='none';
        Premium_user.style.display='block';
        Leaderboardbtn.style.display='block'
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

Leaderboardbtn.onclick=async(e)=>{
  try{
    const response = await axios.get('http://localhost:3000/premium/leaderboard');
    console.log(response.data);
    for (let i=0 ; i<response.data.length;i++){
      showUserLeaderboard(response.data[i]);
    }
  }
  catch(err){
    console.log(err);

  }

}

function showUserLeaderboard(result) {
  const Leaderboard = document.querySelector('.leaderboard');
  const leaderboardDetails = document.createElement('div');
  leaderboardDetails.innerHTML = `Name: ${result.name} - Total Amount: ${result.TotalAmount}`;
  Leaderboard.appendChild(leaderboardDetails);
}
