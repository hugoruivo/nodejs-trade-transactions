var socket = io();

socket.on('newtrade', function(sockmsg){
	var trademsg = sockmsg.trademsg;
	var renderHtml = '<h3>Trade id: ' + trademsg._id + '</h3>';
	renderHtml += '<div class="trade-item-wrapper">';
		renderHtml += '<ul>';
			renderHtml += '<li>';
				renderHtml += "User Id: " + trademsg.userId;
			renderHtml += '</li>';
			renderHtml += '<li>';
				renderHtml += "Currency From: " + trademsg.currencyFrom;
			renderHtml += '</li>';
			renderHtml += '<li>';
				renderHtml += "Currency To: " + trademsg.currencyTo;
			renderHtml += '</li>';
			renderHtml += '<li>';
				renderHtml += "Amount Sell: " + trademsg.amountSell;
			renderHtml += '</li>';
			renderHtml += '<li>';
				renderHtml += "Amount Buy: " + trademsg.amountBuy;
			renderHtml += '</li>';
			renderHtml += '<li>';
				renderHtml += "Rate: " + trademsg.rate;
			renderHtml += '</li>';
			renderHtml += '<li>';
				renderHtml += "Date: " + trademsg.timePlaced;
			renderHtml += '</li>';
			renderHtml += '<li>';
				renderHtml += "Originating Country: " + trademsg.originatingCountry;
			renderHtml += '</li>';
		renderHtml += '</ul>';
	renderHtml += '</div>';


	$('#trades').append(renderHtml);
	$( "#trades" ).accordion( "refresh" );

	$(".txprocessed").text(sockmsg.count);

});
$(document).ready(function () {
	$( ".select-currency-from" ).change(function() {
		var optionSelected = $(this).find("option:selected");
		var valueSelected  = optionSelected.val();
		var textSelected   = optionSelected.text();
		$(".stat-item").stop().hide();
		$(".currency-from-" + valueSelected.toLowerCase()).stop().show();
		$(".select-currency-to").val(0);
	});
	$( ".select-currency-to" ).change(function() {
		var optionSelected = $(this).find("option:selected");
		var valueSelected  = optionSelected.val();
		var textSelected   = optionSelected.text();
		$(".stat-item").stop().hide();
		$(".currency-to-" + valueSelected.toLowerCase()).stop().show();
		$(".select-currency-from").val(0);
	});

	$( "form" ).submit(function( event ) {
		event.preventDefault();
	});
	$("form").validate();

	$(document).on('click', ".insert-tx", function (e) {

		if ($("form").valid()) {
			var formArr = $("form").serializeArray()
			, passObj = {};

			for (var i in formArr) {
				passObj[formArr[i].name] = formArr[i].value;
			}
			$("form")[0].reset();
			insertAjaxTransaction(passObj);
		}
	});

	function insertAjaxTransaction (passData) {
		$.ajax({
			method: "POST",
			url: "/api/trades",
			data: passData
		})
		.done(function (res) {
			if (res.success) {
				alert(res.message);
			}
		});
	}

	function loadAjaxCurrencyStat (currencyType, currency, listSelector) {
		$.ajax({
			method: "POST",
			url: "/api/helper/totalcurrency",
			data: {
				currencyType: currencyType,
				currency: currency
			}
		})
		.done(function (res) {
			if (res.success) {

				var resHtml = "<div class=\"bg-primary\">Stats of type \"" + currencyType + "\" for ";
				resHtml += "currency " + res.results[0]._id + "</div>";
				resHtml += "<ul class=\"bg-success\">"
					resHtml += "<li>"
						resHtml += "Amount of currency Bought: " + res.results[0].amountBuySum;
					resHtml += "</li>"
					resHtml += "<li>"
						resHtml += "Amount of currency Sold: " + res.results[0].amountSellSum;
					resHtml += "</li>"
					resHtml += "<li>"
						resHtml += "Average amount of currency Bought: " + res.results[0].amountBuyAvg;
					resHtml += "</li>"
					resHtml += "<li>"
						resHtml += "Average amount of currency Sold: " + res.results[0].amountSellAvg;
					resHtml += "</li>"
				resHtml += "</ul>"

				$(".currency-stats-wrapper")
					.append($("<div></div>")
					.addClass(listSelector + "-" + currency.toLowerCase() + " stat-item")
					.html(resHtml));
			}
		});
	}

	function loadAjaxStats (currencyType, listSelector) {
		$.ajax({
			method: "POST",
			url: "/api/helper/currencies",
			data: {
				currencyType: currencyType
			}
		})
		.done(function (res) {
			if (res.success) {
				$selectBox = $(".select-" + listSelector);
				$selectBox.find('option:gt(0)').remove();

				for (var i = 0; i < res.currencyType.length; i++) {
					var currency = res.currencyType[i];
					$selectBox
						.append($("<option></option>")
						.attr("value", currency)
						.text(currency));

					loadAjaxCurrencyStat(currencyType, currency, listSelector);
				}
			}
		});
	}

	$( "#trades" ).accordion({
		active: false,
		collapsible: true
	});
	$( ".tabs-wrapper" ).tabs({
		activate: function( event, ui ) {
			if (ui.newTab.hasClass("stats-tab")) {
				$(".currency-stats-wrapper").html("");
				//on tab activate will load the stats
				loadAjaxStats("currencyFrom", "currency-from");
				loadAjaxStats("currencyTo", "currency-to");
			}
			else if(ui.newTab.hasClass("tx-tab")) {
				$( "#trades" ).accordion( "refresh" );
			}
		}
	});
});