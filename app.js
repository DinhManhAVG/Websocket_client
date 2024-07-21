const io = require('socket.io-client');
const readline = require('readline');

// Tạo một interface để đọc input từ command line
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Kết nối tới server Flask-SocketIO
const socket = io('http://127.0.0.1:5996');

socket.on('connect', () => {
    console.log('Connected to the server');
    // Gửi mã Python để thực thi khi kết nối thành công
    socket.emit('execute_code', { code: 'n = input("Please enter a value: "); print(n)' });
});

socket.on('request_input', (data) => {
    console.log(data.message);  // In ra yêu cầu nhập liệu
    rl.question('Input: ', (input) => {
        socket.emit('input_provided', { input: input });
    });
});

socket.on('code_output', (data) => {
    console.log('Output:', data.output);  // In ra kết quả từ server
    rl.close();  // Đóng interface đọc dữ liệu
    socket.close();  // Ngắt kết nối socket khi hoàn tất
});

socket.on('code_error', (data) => {
    console.error('Error:', data.error);
    rl.close();
    socket.close();
});

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});
