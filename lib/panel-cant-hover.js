if (!block) {
				block = true;
			$("#canvas").stop().slideDown(400, function() {
				block = false;
			});
		}
		}).mouseleave(function() {
			if (!block) {
				block = true;
				$('#canvas').stop().slideUp(400, function() {
					block = false;
				});
			}
		});