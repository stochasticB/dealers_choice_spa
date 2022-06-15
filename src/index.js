import axios from 'axios';

const friendList = document.querySelector('#friend-list');
const watchList = document.querySelector('#watch-list');
const salesList = document.querySelector('#sale-list');

let friends, sales;

const renderFriends = (friends) => {
    const friendId = window.location.hash.slice(1);
    const html = friends.map( friend  => `
    <li class = '${ friend.id === friendId ? 'selected': ""}' >
        <a href = '#${ friend.id }'>
            ${ friend.name }
        </a>
    </li>
    `).join('');
    friendList.innerHTML = html;
};

watchList.addEventListener('click', async(ev) => {
    const friendId = window.location.hash.slice(1);
    const target = ev.target;
    if (target.tagName === 'BUTTON'){
        const _sale = {
            watchId: target.getAttribute('data-id')
        };
        const response = await axios.post(`/api/friends/${ friendId }/sales`,_sale);
        const sale = response.data;
        sales.push(sale);
        renderSales(sales);
    }
    
})

salesList.addEventListener('click', async(ev) => {
    const friendId = window.location.hash.slice(1);
    const target = ev.target;

    //console.log(friendId, target)
    if (target.tagName === 'BUTTON'){
        const watchId = ev.target.getAttribute('delete-id');
        await axios.delete(`/api/friends/friendId/${ watchId }`);
        const sale = response.data;
        sales.push(sale);
        renderSales(sales);
    }
    
})

const renderWatches = (watches) => {
    const html = watches.map( watch  => `
    <li>
        ${ watch.name }
        <button data-id = '${ watch.id }'> Add </button>
    </li>
    `).join('');
    watchList.innerHTML = html;
};

const renderSales = (sales) => {
    const html = sales.map( sale  => `
    <li>
        ${ sale.watch.name }
        <button delete-id = ' ${sale.watch.name}' > Remove </button>
    </li>
    `).join('');
    salesList.innerHTML = html;
};


const init = async() => {
    try{
        friends = (await axios.get('/api/friends')).data;
        const watches = (await axios.get('/api/watches')).data;
        renderFriends(friends);
        renderWatches(watches);
        const friendId = window.location.hash.slice(1);
        if(friendId){
            const url = `/api/friends/${ friendId }/sales`;
            sales = (await axios(url)).data;
            renderSales(sales);
        }
    }
    catch(ex){
        console.log(ex); 
    }
}

window.addEventListener('hashchange', async()=> {
    const friendId = window.location.hash.slice(1);
    const url = `/api/friends/${ friendId }/sales`;
    sales = (await axios(url)).data;
    renderSales(sales);
    renderFriends(friends);
})

init(); 