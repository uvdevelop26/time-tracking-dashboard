async function fetchInformation() {
    try {
        const response = await fetch('../../data.json');

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data; // Devolvemos los datos 

    } catch (error) {
        console.error('Ocurrió un error:', error.message);
        return null;
    }
}

async function chargeInformation() {
    const info = await fetchInformation();
    if (!info) return;

    const activNames = Array.from(document.querySelectorAll('.activities_name'));
    const currentTime = Array.from(document.querySelectorAll('.activities_info__time'));
    const previousTime = Array.from(document.querySelectorAll('.activities_info__week'));
    const navButtons = Array.from(document.querySelectorAll('.profile_nav__button'));

    info.forEach((inf, index) => {
        activNames[index].textContent = inf.title;
        currentTime[index].textContent = `${inf.timeframes.daily.current}hrs`
        previousTime[index].textContent = `Yesterday - ${inf.timeframes.daily.previous}hrs`
    });

    navButtons.forEach(button => {
        button.classList.toggle('selected_color', button.textContent === 'Daily');
        button.classList.toggle('non_selected__color', button.textContent !== 'Daily');

        button.addEventListener('click', changeTimeStats);
    });

}

async function changeTimeStats(event) {
    const buttonClicked = event.target;
    const info = await fetchInformation();

    if (!info) return;

    const navButtons = Array.from(document.querySelectorAll('.profile_nav__button'));
    const currentTime = Array.from(document.querySelectorAll('.activities_info__time'));
    const previousTime = Array.from(document.querySelectorAll('.activities_info__week'));

    if (buttonClicked.classList.contains('selected_color')) {
        return;
    } else {
        navButtons.forEach(button => {
            if (button.classList.contains('selected_color')) {
                button.classList.remove('selected_color');
                button.classList.add('non_selected__color');
            }

        });

        buttonClicked.classList.add('selected_color');
        buttonClicked.classList.remove('non_selected__color');

        info.forEach((inf, index) => {
            if (buttonClicked.textContent === 'Daily') {
                currentTime[index].textContent = `${inf.timeframes.daily.current}hrs`
                previousTime[index].textContent = `Yesterday - ${inf.timeframes.daily.previous}hrs`
            } else if (buttonClicked.textContent === 'Weekly') {
                currentTime[index].textContent = `${inf.timeframes.weekly.current}hrs`
                previousTime[index].textContent = `Last Week - ${inf.timeframes.weekly.previous}hrs`
            } else if (buttonClicked.textContent === 'Monthly') {
                currentTime[index].textContent = `${inf.timeframes.monthly.current}hrs`
                previousTime[index].textContent = `Last Month - ${inf.timeframes.monthly.previous}hrs`
            }
        });

    }
}



document.addEventListener('DOMContentLoaded', chargeInformation);