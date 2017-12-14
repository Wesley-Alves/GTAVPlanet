$(document).ready(function() {
	/* Código para fazer modais. Usado na página "Personagens". */
	if ($(".abrir-modal").length) {
		$(window).on("hashchange", function() {
			checkModal();
		});
		
		$(".abrir-modal").click(function (e) {
			e.preventDefault();
			$($(this).attr("href")).addClass("modal-aberto");
		});
		
		$(".fechar-modal").click(function (e) {
			e.preventDefault();
			var modal = $(this).parent().parent();
			modal.children(".modal-body").animate({top: "-100%"}, {duration:300, complete:function() {
				modal.removeClass("modal-aberto");
				modal.children(".modal-body").removeAttr("style");
			}});
		});
		
		function checkModal() {
			if (window.location.hash) {
				var hash = window.location.hash.replace("#", "");
				if ($("#modal-" + hash) && $("#modal-" + hash).hasClass("modal")) {
					$("#modal-" + hash).addClass("modal-aberto");
				}
				
				history.pushState("", document.title, window.location.pathname + window.location.search);
			}
		}
		
		checkModal();
	}
	
	/* Código para colocar barra de scroll no conteúdo. Usado na página "Personagens". */
	if ($(".painel-scroll").length) {
		function ScrollBar(element) {
			var self = this;
			self.scrollContainer = element;
			self.scrollContentWrapper = element.querySelector(".scroll-content");
			self.contentPosition = 0;
			self.normalizedPosition = 0;
			self.scrollerBeingDragged = false;
			self.scroller = document.createElement("div");
			self.scroller.className = "barra-scroll";
			self.scrollerHeight = self.scrollContainer.offsetHeight / self.scrollContentWrapper.scrollHeight * self.scrollContainer.offsetHeight;
			
			if (self.scrollerHeight / self.scrollContainer.offsetHeight < 1) {
				self.scroller.style.height = self.scrollerHeight + "px";
				self.scrollerOffset = self.scrollContentWrapper.scrollHeight <= 450 ? (parseInt(self.scroller.style.height) - 25) : Math.max(parseInt(self.scroller.style.height) / 4, 25);
				self.scrollContainer.appendChild(self.scroller);
				self.scrollContainer.className += " mostrar-scroll";
				
				self.scroller.addEventListener("mousedown", function(e) {
					self.normalizedPosition = e.pageY;
					self.contentPosition = self.scrollContentWrapper.scrollTop;
					self.scrollerBeingDragged = true;
					document.body.classList.add("scroll-rolagem");
				});
				
				window.addEventListener("mouseup", function(e) {
					self.scrollerBeingDragged = false;
					document.body.classList.remove("scroll-rolagem");
				});
				
				window.addEventListener("mousemove", function(e) {
					if (self.scrollerBeingDragged === true) {
						self.scrollContentWrapper.scrollTop = self.contentPosition + ((e.pageY - self.normalizedPosition) * (self.scrollContentWrapper.scrollHeight / self.scrollContainer.offsetHeight));
					}
				});
				
				self.scrollContentWrapper.addEventListener("scroll", function(e) {
					self.scroller.style.top = (e.target.scrollTop / self.scrollContentWrapper.scrollHeight * (self.scrollContainer.offsetHeight - self.scrollerOffset)) + "px";
				});
				
			} else {
				this.scrollContainer.style["padding-right"] = "0%";
			}
		}
		
		var nodes = document.querySelectorAll(".painel-scroll");
		for (var i = 0; i < nodes.length; i++) {
			new ScrollBar(nodes[i]);
		}
	}
	
	/* Código para paginação de conteúdo. Usado nas páginas "Missões" e "Estranhos e Doidos". */
	if ($("div[class='pagina']").length) {
		var currentPage = 1;
		var totalPages = $("div[class='pagina']").length;
		$("#total-paginas").text(totalPages);
		function changePage(first) {
			$("#pagina-atual").text(currentPage);
			$("#pagina-anterior, #pagina-proxima").removeClass("disabled");
			if (currentPage == 1) {
				$("#pagina-anterior").addClass("disabled");
			} else if (currentPage == totalPages) {
				$("#pagina-proxima").addClass("disabled");
			}
			
			$("div[class='pagina']").each(function(index, element) {
				if (parseInt(element.id.replace("pagina-", "")) != currentPage) {
					$(element).css("display", "none");
				} else {
					$(element).css("display", "block");
				}
			});
				
			if (first != true) {
				$("html, body").animate({
					scrollTop: $("#pagina-" + currentPage).offset().top
				}, 300);
			}
		}
		
		$("#pagina-anterior").on("click", function(e) {
			e.preventDefault();
			if (currentPage > 1) {
				currentPage--;
				changePage();
			}
		});
		
		$("#pagina-proxima").on("click", function(e) {
			e.preventDefault();
			if (currentPage <= totalPages - 1) {
				currentPage++;
				changePage();
			}
		});
		
		$(document).on("click", "a[href^='#missao-']", function (e) {
			e.preventDefault();
			currentPage = parseInt($($.attr(this, "href")).parent().attr("id").replace("pagina-", ""));
			changePage();
			$("html, body").animate({
				scrollTop: $($.attr(this, "href")).offset().top
			}, 300);
		});
		
		changePage(true);
	}
	
	/* Código para expandir uma imagem quando clicada. Usado na página "veículos". */
	if ($("#veiculos img").length) {
		$("#veiculos img").click(function(e) {
			e.preventDefault();
			if ($("#caixa-imagem").length > 0) {
				$("#caixa-imagem-content").html("<img src=\"" + $(this).attr("src") + "\">");
			} else {
				$("body").append(
					"<div id=\"caixa-imagem\" style=\"display:none;\">" +
						"<p>×</p>" +
						"<div id=\"caixa-imagem-content\">" +
							"<img src=\"" + $(this).attr("src") + "\">" +
						"</div>" +	
					"</div>"
				);
			}
			
			$("#caixa-imagem img").css("max-height", ($("#caixa-imagem").height() - 60) + "px");
			$("#caixa-imagem").fadeIn(400);
		});
		
		$("body").on("click", "#caixa-imagem", function() {
			$("#caixa-imagem").fadeOut(300);
		});
	}
	
	/* Código para slider de imagens. Usado na página "galeria". */
	if ($("#slider ul li").length) {
		var length = $("#slider ul li").length;
		var width = $("#slider ul li").width();
		var movingSlider = false;
		var dataVal = 1;
		$("#slider ul li").each(function(){
			$(this).attr("data-img", dataVal);
			$("#pager").append("<a data-img=\"" + dataVal + "\"><img src=" + $("img", this).attr("src") + "></a>");
			$("#pager a[data-img=\"" + dataVal + "\"]");
			dataVal++;
		});
		
		$("#slider ul").width(width * (length + 2));
		$("#slider ul li:first-child").clone().appendTo("#slider ul");
		$("#slider ul li:nth-child(" + length + ")").clone().prependTo("#slider ul");
		$("#slider ul").css("margin-left", - width);
		$("#slider ul li:nth-child(2)").addClass("active");

		var imgPos = pagerPos = parseInt($("#slider ul li.active").attr("data-img"));
		$("#pager a:nth-child(" +pagerPos+ ")").addClass("active");

		$("#pager a").on("click", function() {
			if (!movingSlider) {
				pagerPos = parseInt($(this).attr("data-img"));
				$("#pager a.active").removeClass("active");
				$(this).addClass("active");
				if (pagerPos > imgPos) {
					moveNext(width * (pagerPos - imgPos));
				} else if (pagerPos < imgPos) {
					movePrev(width * (imgPos - pagerPos));
				}
			}
			
			return false;
		});

		$("#sliderNext").on("click", function() {
			moveNext(width);
			return false;
		});

		$("#sliderPrev").on("click", function() {
			movePrev(width);
			return false;
		});

		function pagerActive() {
			pagerPos = imgPos;
			$("#pager a.active").removeClass("active");
			$("#pager a[data-img=\"" + pagerPos + "\"]").addClass("active");
			movingSlider = false;
		}

		function moveNext(moveWidth) {
			movingSlider = true;
			$("#slider ul").animate({"margin-left": "-=" + moveWidth}, 500, function() {
				if (imgPos == length) {
					imgPos = 1;
					$("#slider ul").css("margin-left", -width);
				} else if (pagerPos > imgPos) {
					imgPos = pagerPos;
				} else {
					imgPos++;
				}
				
				pagerActive();
			});
		}

		function movePrev(moveWidth) {
			movingSlider = true;
			$("#slider ul").animate({"margin-left": "+=" + moveWidth}, 500, function() {
				if (imgPos == 1) {
					imgPos = length;
					$("#slider ul").css("margin-left", -(width * length));
				} else if (pagerPos < imgPos) {
					imgPos = pagerPos;
				} else {
					imgPos--;
				}
				
				pagerActive();
			});
		}
	}
	
	/* Código para o formulário. Usado na página "Fale Conosco". */
	if ($("#fale-conosco").length) {
		$("#fale-conosco").on("submit", function() {
			$("#fale-conosco").html("<p>Obrigado pelo contato ! Enviaremos uma resposta assim que possível.</p>");
			return false;
		})
	}
});