// Validates user registration payload
export function validateRegister(req, res, next) {
  const { firstName, lastName, email, password } = req.body;
  const errors = {};

  if (!firstName?.trim() || firstName.trim().length < 2)
    errors.firstName = 'Ім\'я має містити щонайменше 2 символи';
  if (!lastName?.trim() || lastName.trim().length < 2)
    errors.lastName = 'Прізвище має містити щонайменше 2 символи';
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email))
    errors.email = 'Введіть коректний email';
  if (!password || password.length < 6)
    errors.password = 'Пароль має містити щонайменше 6 символів';

  if (Object.keys(errors).length > 0)
    return res.status(400).json({ error: 'Помилка валідації', errors });

  next();
}

// Validates user login credentials
export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email))
    errors.email = 'Введіть коректний email';
  if (!password)
    errors.password = 'Пароль обов\'язковий';

  if (Object.keys(errors).length > 0)
    return res.status(400).json({ error: 'Помилка валідації', errors });

  next();
}

// Validates social service application form data
export function validateApplication(req, res, next) {
  const { fullName, idCode, phone, address, serviceType, region } = req.body;
  const errors = {};

  if (!fullName?.trim() || fullName.trim().length < 3)
    errors.fullName = 'Введіть повне ім\'я';
  if (!idCode || !/^\d{10}$/.test(idCode.trim()))
    errors.idCode = 'ІПН має містити рівно 10 цифр';
  if (!phone?.trim() || phone.trim().length < 7)
    errors.phone = 'Введіть коректний номер телефону';
  if (!address?.trim() || address.trim().length < 5)
    errors.address = 'Введіть адресу проживання';
  if (!serviceType)
    errors.serviceType = 'Оберіть вид послуги';
  if (!region)
    errors.region = 'Оберіть регіон';

  if (Object.keys(errors).length > 0)
    return res.status(400).json({ error: 'Помилка валідації', errors });

  next();
}

// Validates feedback/contact form submissions
export function validateFeedback(req, res, next) {
  const { email, message } = req.body;
  const errors = {};

  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email))
    errors.email = 'Введіть коректний email';
  if (!message?.trim() || message.trim().length < 5)
    errors.message = 'Повідомлення занадто коротке';

  if (Object.keys(errors).length > 0)
    return res.status(400).json({ error: 'Помилка валідації', errors });

  next();
}
