const BASE_URL = "http://127.0.0.1:5000/api";


function generateCupcakeHTML(cupcake) {
    return `
        <div data-cupcake-id="${cupcake.id}" class="row mb-4 cupcake-container">
            <div class="col-2">
                <span class="img-icon">
                    <img class src="${cupcake.image}" alt="">
                </span>
            </div>
            <div class="col-6">
                <h3 class="title">${cupcake.flavor}</h3>
                <p><b>Rating:</b> ${cupcake.rating} | <b>Size:</b> ${cupcake.size} | <a class="delete-button fw-bold text-danger" href="">delete</a></p>
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


/** handle form submition for adding new cupcake */

$("#add-cupcake-form").on("submit", async function (evt) {
    evt.preventDefault();

    let flavor = $("#input-flavor").val();
    let rating = $("#input-rating").val();
    let size = $("#input-size").val();
    let image = $("#input-image").val();

    const newCupcakeRes = await axios.post(`${BASE_URL}/cupcakes`, {
        flavor, rating, size, image
    });
    console.log(newCupcakeRes);

    let newCupcake = $(generateCupcakeHTML(newCupcakeRes.data.new_cupcake));
    $("#all-cupcakes").append(newCupcake);
    $("#add-cupcake-form").trigger("reset");
});


/** handle delete event for selected cupcake */

$('#all-cupcakes').on("click", ".delete-button", async function (evt) {
    evt.preventDefault();
    let $cupcake = $(evt.target).closest("div.cupcake-container");
    let cupcakeId = $cupcake.attr("data-cupcake-id");

    await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
    $cupcake.remove();
});


$(showAllCupcakes);