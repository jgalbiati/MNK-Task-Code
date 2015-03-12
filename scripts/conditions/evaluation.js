function Condition_Evaluation() {
	var that = this;
	this.duration = 20;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000 * this.duration;
	this.instructions = "String of instructions...";
	this.states = _.shuffle(evaluation_positions);
	this.ntrials = this.states.length
	this.color_indicators = ["BLACK", "WHITE"];
	this.current_trial = 0;
	this.current_position = {}

	this.load_game = function(b, position_list) {
		b.loaded_game = position_list[that.current_trial];
		b.black_position = restore_array(b.loaded_game.boards.black_position);
		b.white_position = restore_array(b.loaded_game.boards.white_position);
		for(i=0; i<M*N; i++){
			if(b.black_position[i] == 1) {
				b.add_piece(i, 0)
			} else if(b.white_position[i] == 1) {
				b.add_piece(i, 1)
			}
		}
		$(".indicator").html("<h1>You are playing <b>" + that.color_indicators[b.loaded_game.color].toUpperCase() + "</b></h1>").css("color","#000000");
	}

	this.action = function(b,p) {
		$('.canvas, .canvas div').css('cursor', 'default');
		p.move_start = Date.now();
		setTimeout(function(){$('input[name="radio"]').attr('disabled', false).css("cursor","pointer")}, 500)
		$('input[name="radio"]').on('click', function(e) {
			p.move_end = Date.now();
			$('input[name="radio"]').off('click').attr('disabled', true).css("cursor","default");
			p.move = $(this).attr('value');
			p.duration = p.move_end - p.move_start
			var send_promise = ajax_submit_response(b, p);
			send_promise.done(function() {
				that.current_trial ++;
				setTimeout(that.do_trial, 500);
			});
		});
	}

	this.do_trial = function() {
		if(that.current_trial < that.ntrials) {
			board = new Board();
			board.create_tiles();
			$('.tile').css('cursor', 'default');
			$('input[name="radio"]').prop('checked', false);
			board.game_status = "EVAL";
			that.load_game(board, that.states);
			that.action(board, player);
		} else {
			$(".eval-element").animate({"opacity":"0.0"}, 500)
			current_block ++;
			player.game_index ++;
			blocks[current_block].run_block();
		}
	}

	this.countdown = function(i) {
		if(i>0) {
			$('#block-modal button').text(i);
			setTimeout(function(){that.countdown(i-1)}, 1000);
		} else {
			$('#block-modal .modal-body').html(instEVAL);
			$('#block-modal button').text("Start").prop('disabled', false);
		}
	}

	this.run_block = function() {
		$("html, #scale-label, input[type=radio], .scorebox").css("cursor", "default");
		$(".scorebox").animate({backgroundColor:"#FFFFFF", color:"FFFFFF", borderColor:"#FFFFFF"}, 2000);
		$(".indicator").html("<h1>You are playing <b>BLACK</b></h1>").css("color","#FFFFFF");
		$(".eval-element").animate({"opacity":"1.0"}, 500)
		board = new Board();
		board.create_tiles();
		board.highlight_tiles();
		$('#block-modal .modal-body').html("<b>Please take a break before beginning the next task!</b><br><br>");
		$('#block-modal').modal('show');
				$('#block-modal .modal-body').html("<b>You're done with this part of the task.</b><br><br>Please take a break and find the experimenter when you are ready to continue.");
		$('#block-modal').modal('show');
		/*$('#block-modal button').off('click').prop('disabled', true).on('click', */
		$(document).on('keydown', function(e) {
			if (e.keyCode==192){
				$('#block-modal .modal-body').html(instEVAL);
				$(document).off('keydown').on('keydown', function(e){
					if (e.keyCode==192){
						$('#block-modal').modal('hide');
						that.do_trial();
						$(document).off('keydown');
					}
				});
			}
		});
	}
}

var evaluation_positions = [new State('000000000010100010000000000100100010', '000010001000001000000010100000001000', 11, 23, 'BLACK'),
  new State('000010000011101000010010000001100100', '001101100100010100000101000000001000', 28, 7, 'BLACK'),
  new State('000000000000001100000010100000001000', '000000000000010000000101000000110000', 16, 12, 'BLACK'),
  new State('000000000010100010000001000100100010', '000010101000001000000010100000001000', 11, 7, 'BLACK'),
  new State('000010010001000000000101100000100001', '000101101000001010000010000000001000', 31, 15, 'BLACK'),
  new State('000000000000001100000010100000001100', '000000100000010000000101000000110000', 12, 16, 'BLACK'),
  new State('000000000000001000001010100000001000', '001010000000000000100101000000000000', 30, 16, 'BLACK'),
  new State('000000000000001100000000100000001000', '000000000000010000000001000000110000', 16, 33, 'BLACK'),
  new State('001100100001110000011100010000011010', '010001010000001100100011100100100100', 10, 29, 'WHITE'),
  new State('000001000001100000001010000000000000', '000010000000001000000001000000001000', 24, 13, 'WHITE'),
  new State('000001001000010100000001000000001001', '001010000001101000010000010000000000', 7, 3, 'BLACK'),
  new State('001101100000010000001101000010010000', '000010000000101000000010000101101100', 34, 7, 'WHITE'),
  new State('000001000000110000001100000000100000', '000110000000001000000011000001000000', 10, 24, 'BLACK'),
  new State('000001000001100000001010000000000000', '000010000000001000000001000000011000', 21, 10, 'BLACK'),
  new State('001001110011101000001100100100110100', '010100000100010110110011000011001010', 25, 17, 'WHITE'),
  new State('000000000000011000000100000000011001', '000000100000100000001010000000100000', 4, 5, 'WHITE'),
  new State('000011100000101110000011000000000000', '000100010000010001000000100100101000', 31, 20, 'WHITE'),
  new State('000001100000001110000010000000000000', '000000000000010001000000100100100000', 29, 7, 'WHITE'),
  new State('001000000000001100000001100000010000', '000010010000110000000010000000001000', 16, 25, 'BLACK'),
  new State('000000000010110000000100000000000000', '000000000001000000000000000101010000', 30, 22, 'BLACK'),
  new State('000011000000010000000000000000000000', '000100000000000000000100000000000000', 12, 22, 'WHITE'),
  new State('001100100001011100000100100010100000', '100011000000100010010011000000001100', 31, 29, 'WHITE'),
  new State('000000000001010000001001000000101000', '001100000000100000000110000000000000', 4, 5, 'WHITE'),
  new State('000100000000001000000011000001010000', '000001000000110000001100000000100000', 24, 15, 'BLACK'),
  new State('000100100000010000001100000000001000', '000001000000001100000011000000000000', 25, 24, 'WHITE'),
  new State('000000000000100000000101000000010000', '000110000000010000000010000000000000', 5, 15, 'BLACK'),
  new State('000000000001110000000001000000101000', '000100000010001000000110000000000000', 31, 20, 'WHITE'),
  new State('000100000001100000000100000000000000', '000000000000010000010000000000110000', 4, 32, 'BLACK'),
  new State('001000000000001000000001100000010000', '000010000000110000000010000000001000', 15, 7, 'BLACK'),
  new State('000110000001000000010111000000101000', '010001000010110000001000100100000000', 14, 15, 'WHITE'),
  new State('011100001100011010011100000001010001', '100011000011100100100010110000001110', 23, 28, 'BLACK'),
  new State('011000000001000000001100000000100000', '000000000000000010000010000001011000', 24, 4, 'WHITE'),
  new State('000000000000010000001011100000101100', '000110000000101000000100010000010000', 5, 1, 'WHITE'),
  new State('100110000001000000001000000010010000', '010000000010101000000111000000000000', 24, 29, 'BLACK'),
  new State('100000001000000000000101000100100000', '000001000000110000000000000000001001', 22, 15, 'WHITE'),
  new State('001100100001011100000100100000100000', '100011000000100010000011000000001100', 20, 34, 'WHITE'),
  new State('000000000000010000000010100000011000', '000011000000001000000001000000000000', 6, 3, 'WHITE'),
  new State('000000000000100000001010000100100000', '000000000000001000000100010000001000', 5, 23, 'WHITE'),
  new State('100000001010100000000101000000110000', '000110000001000100001010000010000000', 5, 2, 'WHITE'),
  new State('000000000010100000000000000100100000', '000010001000000000000000100000000000', 14, 32, 'WHITE'),
  new State('001000000001010000010100000001000000', '000001000000100000001001000000010000', 32, 4, 'WHITE'),
  new State('100110000001000000001000100010010000', '010000000010101000000111000000000000', 32, 13, 'WHITE'),
  new State('000001000000100000001010000000000100', '000000000000001100000001000000011000', 7, 21, 'BLACK'),
  new State('000000000000100000001011010000001000', '001010000001010000000100100000000000', 5, 31, 'BLACK')];
