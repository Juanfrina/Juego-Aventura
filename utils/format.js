export function showScene(id) {
    document.querySelectorAll('.scene').forEach(
        element => element.classList.remove('active')
    );
    document.getElementById(id).classList.add('active');
}