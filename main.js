const copartData = {};
let copartFrom = {};
let copartTo = {};

const iaaiData = {};
let iaaiFrom = {};
let iaaiTo = {};

Copart.map((item, index) => {
    if (index) {
        if (!copartFrom[item.From]) {
            copartFrom[item.From] = [
                { from: item.From, to: item.To, price: item.Column5 },
            ];
        } else {
            copartFrom[item.From].push({
                from: item.From,
                to: item.To,
                price: item.Column5,
            });
        }
    }
});

Iaai.map((item, index) => {
    if (index) {
        if (!iaaiFrom[item.From]) {
            iaaiFrom[item.From] = [
                { from: item.From, to: item.To, price: item.Column5 },
            ];
        } else {
            iaaiFrom[item.From].push({
                from: item.From,
                to: item.To,
                price: item.Column5,
            });
        }
    }
});

const copartFromKeys = Object.keys(copartFrom);
const iaaiFromKeys = Object.keys(iaaiFrom);

$(document).ready(function () {
    let auction;
    let from;
    $(".auction")
        .select2({ placeholder: "Auction", allowClear: true })
        .on("change", function (e) {
            const data = e.target.value;
            const iaaiSelectContainer = document.querySelector(
                ".iaai-select-container"
            );
            const copartSelectContainer = document.querySelector(
                ".copart-select-container"
            );
            if (data === "iaai") {
                auction = "iaai";
                iaaiSelectContainer.style.display = "block";
                copartSelectContainer.style.display = "none";
            } else if (data === "copart") {
                auction = "copart";
                copartSelectContainer.style.display = "block";
                iaaiSelectContainer.style.display = "none";
            }
            search(data, from);
        });

    const copartSelectFrom = document.querySelector(".copart-select-from");
    copartFromKeys.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.append(item);
        copartSelectFrom.append(option);
    });

    $(".copart-select-from")
        .select2({ placeholder: "From", allowClear: true, width: "resolve" })
        .on("change", function (e) {
            const value = e.target.value;
            from = value;
            search(auction, from);
        });

    const iaaiSelectFrom = document.querySelector(".iaai-select-from");
    iaaiFromKeys.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.append(item);
        iaaiSelectFrom.append(option);
    });


    $(".iaai-select-from")
        .select2({
            placeholder: "From",
            width: "100%",
        })
        .on("change", function (e) {
            const value = e.target.value;
            from = value;
            search(auction, from);
        });

    function search(auction, from) {
        if (auction && from) {
            let fromValues;
            if (auction === "iaai") {
                fromValues = iaaiFrom[from];
                if(fromValues){
                    $('.iaai-select-from').val(from);
                    $('.iaai-select-from').trigger('change.select2');
                }
            } else if (auction === "copart") {
                fromValues = copartFrom[from];
                if(fromValues){
                    $('.copart-select-from').val(from);
                    $('.copart-select-from').trigger('change.select2');
                }
            }

            if(window.innerWidth > '1000'){
                const results = document.querySelector(".results");
                results.innerHTML = "";

                if (fromValues?.length) {
                    fromValues.map((item) => {
                        const content = `
                <div>
                    <span>${auction}</span>
                    <span>${item.from}</span>
                    <span>${item.to}</span>
                    <span>${
                            item.price + (item.price !== "Call" ? "$" : "")
                        }</span>
                </div>
            `;
                        results.insertAdjacentHTML("beforeend", content);
                    });
                }
            }else{
                if (fromValues?.length) {
                    let auctionText = '';
                    let fromText = '';
                    let toText = '';
                    let priceText = '';
                    fromValues.map((item) => {
                        auctionText = auction.toUpperCase();
                        fromText = item.from;
                        toText = !toText ? item.to : `${toText} | ${item.to}`;
                        priceText = !priceText ? (item.price !== 'Call' ? item.price + '$' : item.price) : `${priceText} | ${item.price !== 'Call' ? item.price + '$' : item.price}`;
                    });
                    const auctionSmall = document.querySelector('.auction-small span:last-child');
                    const fromSmall = document.querySelector('.from-small span:last-child');
                    const toSmall = document.querySelector('.to-small span:last-child');
                    const priceSmall = document.querySelector('.price-small span:last-child');
                    auctionSmall.innerHTML = auctionText;
                    fromSmall.innerHTML = fromText;
                    toSmall.innerHTML = toText;
                    priceSmall.innerHTML = priceText;
                }
            }

        }
    }
});
