const BASE_URL = "http://127.0.0.1:5000/api";


function generateCupcakeHTML(cupcake) {
    return `
        <div id="${cupcake.id}" class="row mb-4">
            <div class="col-2">
                <span class="img-icon">
                    <img class src="${cupcake.image}" alt="">
                </span>
            </div>
            <div class="col-6">
                <h3 class="title">${cupcake.flavor}</h3>
                <p><b>Rating:</b> ${cupcake.rating} | <b>Size:</b> ${cupcake.size}</p>
            </div>
        </div>
    `;
}

/** list initial cupcakes on page */

async function showAllCupcakes() {
    const res = await axios.get(`${BASE_URL}/cupcakes`);

    for (let cupcakeData of res.data.cupcakes) {
        let newCupcake = $(generateCupcakeHTML(cupcakeData));
        $("#all-cupcakes").append(newCupcake);
    }
}




$('.delete-cupcake').click(deleteCupcake)

async function deleteCupcake() {
    const id = $(this).data('id')
    await axios.delete(`/api/cupcakes/${id}`)
    $(this).parent().remove()
}

$(showAllCupcakes);