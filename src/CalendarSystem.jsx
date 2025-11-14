import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Edit2, Trash2, Clock, LogOut, Settings, User, Eye, EyeOff, Upload, Tag, Menu } from 'lucide-react';

const CalendarSystem = () => {
  // Estados principais
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [isSelectingDates, setIsSelectingDates] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [filterYear, setFilterYear] = useState(2026);
  const [filterMonth, setFilterMonth] = useState('all');
  const [logoUrl, setLogoUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'user'
  });
  const [loginError, setLoginError] = useState('');

  // Estados de formulários
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    type: '',
    color: '#3b82f6',
    notes: '',
    weekdaySchedule: {
      monday: { enabled: false, startTime: '13:00', endTime: '17:00' },
      tuesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      wednesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      thursday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      friday: { enabled: false, startTime: '08:00', endTime: '12:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '18:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '18:00' }
    }
  });
  const [typeFormData, setTypeFormData] = useState({
    value: '',
    label: '',
    defaultColor: '#3b82f6'
  });

  const weekdayNames = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadData();
  }, []);

  // Atualizar formData.type quando eventTypes carregar
  useEffect(() => {
    if (eventTypes.length > 0 && !formData.type) {
      const firstType = eventTypes[0];
      setFormData(prev => ({ 
        ...prev, 
        type: firstType.value,
        color: firstType.defaultColor 
      }));
    }
  }, [eventTypes]);

  // Recarregar usuários quando painel admin abre
  useEffect(() => {
    if (showAdminPanel && currentUser?.role === 'admin') {
      loadUsers();
    }
  }, [showAdminPanel]);

  const loadUsers = async () => {
    console.log('=== loadUsers iniciado ===');
    try {
      const usersData = await window.storage.get('system-users');
      console.log('Dados do storage:', usersData);
      
      if (usersData) {
        const parsedUsers = JSON.parse(usersData.value);
        console.log('Usuários parseados:', parsedUsers);
        setUsers(parsedUsers);
        console.log('setUsers chamado com', parsedUsers.length, 'usuários');
      } else {
        console.log('Nenhum dado encontrado, criando usuário padrão');
        // Criar usuário padrão
        const defaultUsers = [
          { id: 1, username: 'adm', password: 'senaisp@2025', role: 'admin', name: 'Administrador' }
        ];
        await window.storage.set('system-users', JSON.stringify(defaultUsers));
        setUsers(defaultUsers);
        console.log('Usuário padrão criado e setado');
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      const defaultUsers = [
        { id: 1, username: 'adm', password: 'senaisp@2025', role: 'admin', name: 'Administrador' }
      ];
      setUsers(defaultUsers);
    }
  };

  const loadData = async () => {
    try {
      // Carregar logo
      const savedLogo = await window.storage.get('system-logo');
      if (savedLogo) {
        setLogoUrl(savedLogo.value);
      }

      // Carregar usuários
      await loadUsers();

      // Carregar tipos de eventos
      const savedTypes = await window.storage.get('event-types');
      if (savedTypes) {
        setEventTypes(JSON.parse(savedTypes.value));
      } else {
        // Tipos padrão
        const defaultTypes = [
          { value: 'workshop', label: 'Workshop', defaultColor: '#3b82f6' },
          { value: 'competition', label: 'Competição', defaultColor: '#ef4444' },
          { value: 'training', label: 'Treino', defaultColor: '#10b981' },
          { value: 'meeting', label: 'Reunião', defaultColor: '#f59e0b' },
          { value: 'vacation', label: 'Férias', defaultColor: '#8b5cf6' },
          { value: 'other', label: 'Outro', defaultColor: '#6b7280' }
        ];
        setEventTypes(defaultTypes);
        await window.storage.set('event-types', JSON.stringify(defaultTypes));
      }

      // Carregar eventos compartilhados
      const savedEvents = await window.storage.get('calendar-events', true);
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents.value));
      }

      // Verificar sessão
      const session = await window.storage.get('current-session');
      if (session) {
        const userData = JSON.parse(session.value);
        if (Date.now() < userData.expiresAt) {
          setCurrentUser(userData);
          setShowLoginModal(false);
        }
      }
    } catch (error) {
      console.log('Primeira execução ou dados não encontrados');
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError(''); // Limpar erro anterior
    
    try {
      let usersList = users;
      
      // Se não há usuários carregados, tentar carregar do storage
      if (usersList.length === 0) {
        try {
          const usersData = await window.storage.get('system-users');
          if (usersData) {
            usersList = JSON.parse(usersData.value);
          }
        } catch (storageError) {
          console.log('Erro ao acessar storage, usando usuários padrão');
        }
        
        // Se ainda não encontrou usuários, usar padrão
        if (usersList.length === 0) {
          usersList = [
            { id: 1, username: 'adm', password: 'senaisp@2025', role: 'admin', name: 'Administrador' }
          ];
          try {
            await window.storage.set('system-users', JSON.stringify(usersList));
          } catch (e) {
            console.log('Não foi possível salvar usuários');
          }
        }
      }

      const user = usersList.find(u => 
        u.username === loginData.username && u.password === loginData.password
      );

      if (user) {
        const sessionData = {
          ...user,
          password: undefined,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        };
        try {
          await window.storage.set('current-session', JSON.stringify(sessionData));
        } catch (e) {
          console.log('Não foi possível salvar sessão, mas continuando...');
        }
        setCurrentUser(sessionData);
        setShowLoginModal(false);
        setLoginData({ username: '', password: '' });
        setLoginError('');
      } else {
        setLoginError('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoginError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await window.storage.delete('current-session');
      setCurrentUser(null);
      setShowLoginModal(true);
      setShowAdminPanel(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target.result;
        try {
          await window.storage.set('system-logo', dataUrl);
          setLogoUrl(dataUrl);
          alert('Logo atualizada com sucesso!');
        } catch (error) {
          console.error('Erro ao salvar logo:', error);
          alert('Erro ao salvar logo.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEvents = async (newEvents) => {
    try {
      await window.storage.set('calendar-events', JSON.stringify(newEvents), true);
      setEvents(newEvents);
      return true;
    } catch (error) {
      console.error('Erro ao salvar eventos:', error);
      // Fallback: salvar apenas em memória se o storage falhar
      setEvents(newEvents);
      alert('Aviso: Evento salvo apenas na sessão atual (não será persistido após recarregar)');
      return true;
    }
  };

  const saveEventTypes = async (newTypes) => {
    try {
      await window.storage.set('event-types', JSON.stringify(newTypes));
      setEventTypes(newTypes);
    } catch (error) {
      console.error('Erro ao salvar tipos:', error);
      alert('Erro ao salvar tipo de evento. Tente novamente.');
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit chamado');
    console.log('FormData:', formData);
    
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Por favor, preencha os campos obrigatórios: Título, Data de Início e Data de Término');
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (start > end) {
      alert('A data de início não pode ser posterior à data de término');
      return;
    }
    
    setIsSaving(true);
    try {
      if (editingEvent) {
        const updated = events.map(ev => 
          ev.id === editingEvent.id ? { ...formData, id: ev.id } : ev
        );
        const success = await saveEvents(updated);
        if (success) {
          alert('Evento atualizado com sucesso!');
        }
      } else {
        const newEvent = { ...formData, id: Date.now() };
        const success = await saveEvents([...events, newEvent]);
        if (success) {
          alert('Evento criado com sucesso!');
        }
      }
      resetForm();
    } catch (error) {
      console.error('Erro em handleSubmit:', error);
      alert('Erro ao salvar evento: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      await saveEvents(events.filter(ev => ev.id !== id));
    }
  };

  const handleTypeSubmit = async () => {
    if (!typeFormData.value || !typeFormData.label) {
      alert('Preencha todos os campos do tipo de evento');
      return;
    }

    if (editingType) {
      const updated = eventTypes.map(t => 
        t.value === editingType.value ? typeFormData : t
      );
      await saveEventTypes(updated);
    } else {
      if (eventTypes.some(t => t.value === typeFormData.value)) {
        alert('Já existe um tipo com este identificador');
        return;
      }
      await saveEventTypes([...eventTypes, typeFormData]);
    }
    
    setTypeFormData({ value: '', label: '', defaultColor: '#3b82f6' });
    setEditingType(null);
    setShowTypeModal(false);
  };

  const handleDeleteType = async (value) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de evento?')) {
      await saveEventTypes(eventTypes.filter(t => t.value !== value));
    }
  };

  const handleUserSubmit = async () => {
    try {
      console.log('=== handleUserSubmit INICIADO ===');
      console.log('userFormData:', JSON.stringify(userFormData, null, 2));
      console.log('editingUser:', editingUser);
      console.log('users atuais:', JSON.stringify(users, null, 2));
      
      // Validação
      if (!userFormData.username || userFormData.username.trim() === '') {
        console.error('Validação falhou: username vazio');
        alert('O nome de usuário é obrigatório');
        return;
      }
      
      if (!userFormData.name || userFormData.name.trim() === '') {
        console.error('Validação falhou: name vazio');
        alert('O nome completo é obrigatório');
        return;
      }

      if (editingUser) {
        console.log('Modo EDIÇÃO');
        // Editar usuário existente
        const updated = users.map(u => {
          if (u.id === editingUser.id) {
            // Se senha estiver vazia, manter a senha antiga
            const updatedUser = { 
              id: u.id,
              username: userFormData.username,
              name: userFormData.name,
              role: userFormData.role,
              password: (userFormData.password && userFormData.password.trim() !== '') ? userFormData.password : u.password
            };
            return updatedUser;
          }
          return u;
        });
        console.log('Usuários atualizados (edição):', JSON.stringify(updated, null, 2));
        
        const jsonToSave = JSON.stringify(updated);
        console.log('Salvando no storage (edição):', jsonToSave);
        await window.storage.set('system-users', jsonToSave);
        setUsers(updated);
        console.log('Estado users atualizado (edição)');
        alert('Usuário atualizado com sucesso!');
      } else {
        console.log('Modo CRIAÇÃO');
        // Criar novo usuário
        if (!userFormData.password || userFormData.password.trim() === '') {
          console.error('Validação falhou: senha vazia');
          alert('A senha é obrigatória para novos usuários');
          return;
        }
        
        // Verificar se usuário já existe
        const userExists = users.find(u => u.username === userFormData.username);
        if (userExists) {
          console.error('Usuário duplicado:', userExists);
          alert('Já existe um usuário com este nome de usuário: ' + userFormData.username);
          return;
        }
        
        const newUser = {
          id: Date.now(),
          username: userFormData.username.trim(),
          password: userFormData.password,
          name: userFormData.name.trim(),
          role: userFormData.role
        };
        
        console.log('✓ Novo usuário criado:', JSON.stringify(newUser, null, 2));
        
        const updated = [...users, newUser];
        console.log('✓ Lista completa:', JSON.stringify(updated, null, 2));
        console.log('✓ Número de usuários:', updated.length);
        
        const jsonToSave = JSON.stringify(updated);
        console.log('✓ String JSON a salvar:', jsonToSave);
        
        // Salvar no storage
        console.log('Chamando window.storage.set...');
        await window.storage.set('system-users', jsonToSave);
        console.log('✓✓✓ SALVO NO STORAGE COM SUCESSO');
        
        // Atualizar estado
        console.log('Chamando setUsers...');
        setUsers(updated);
        console.log('✓✓✓ setUsers EXECUTADO');
        
        // Verificar se salvou mesmo
        console.log('Aguardando 300ms para verificação...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('Verificando storage...');
        const verification = await window.storage.get('system-users');
        console.log('Dados de verificação:', verification);
        
        if (verification) {
          const parsedVerification = JSON.parse(verification.value);
          console.log('✓ Usuários verificados no storage:', parsedVerification);
          console.log('✓ Quantidade verificada:', parsedVerification.length);
          // Forçar atualização do estado com os dados do storage
          setUsers(parsedVerification);
          console.log('✓✓✓ ESTADO ATUALIZADO COM VERIFICAÇÃO');
        } else {
          console.error('!!! VERIFICAÇÃO FALHOU - Storage vazio');
        }
        
        alert('Usuário criado com sucesso!');
      }
      
      // Limpar formulário
      console.log('Limpando formulário...');
      setUserFormData({ username: '', password: '', name: '', role: 'user' });
      setEditingUser(null);
      setShowUserModal(false);
      
      console.log('=== handleUserSubmit CONCLUÍDO COM SUCESSO ===');
    } catch (error) {
      console.error('!!! ERRO CRÍTICO em handleUserSubmit !!!');
      console.error('Tipo do erro:', error.name);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      alert('ERRO ao salvar usuário: ' + error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    // Não permitir deletar o último admin
    const user = users.find(u => u.id === id);
    if (user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
      alert('Não é possível excluir o único administrador do sistema!');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      const updated = users.filter(u => u.id !== id);
      try {
        await window.storage.set('system-users', JSON.stringify(updated));
        setUsers(updated);
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      type: eventTypes[0]?.value || '',
      color: '#3b82f6',
      notes: '',
      weekdaySchedule: {
        monday: { enabled: false, startTime: '13:00', endTime: '17:00' },
        tuesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
        wednesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
        thursday: { enabled: false, startTime: '08:00', endTime: '17:00' },
        friday: { enabled: false, startTime: '08:00', endTime: '12:00' },
        saturday: { enabled: false, startTime: '09:00', endTime: '18:00' },
        sunday: { enabled: false, startTime: '09:00', endTime: '18:00' }
      }
    });
    setEditingEvent(null);
    setShowModal(false);
    setIsSelectingDates(false);
    setHoveredDate(null);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInRange = (date, startDate, endDate) => {
    const d = new Date(date + 'T00:00:00');
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    return d >= start && d <= end;
  };

  const isDateBetween = (date, start, end) => {
    if (!start || !end) return false;
    const d = new Date(date + 'T00:00:00');
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    return d >= s && d <= e;
  };

  const getEventsForDate = (dateStr) => {
    return events.filter(event => 
      isDateInRange(dateStr, event.startDate, event.endDate)
    );
  };

  const handleDateClick = (dateStr) => {
    if (!formData.startDate) {
      setFormData({...formData, startDate: dateStr, endDate: ''});
    } else if (!formData.endDate) {
      const start = new Date(formData.startDate + 'T00:00:00');
      const clicked = new Date(dateStr + 'T00:00:00');
      
      if (clicked >= start) {
        setFormData({...formData, endDate: dateStr});
      } else {
        setFormData({...formData, startDate: dateStr, endDate: formData.startDate});
      }
      setIsSelectingDates(false);
      setHoveredDate(null);
    }
  };

  const startDateSelection = () => {
    setIsSelectingDates(true);
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
    setFormData({...formData, startDate: '', endDate: ''});
  };

  const cancelDateSelection = () => {
    setIsSelectingDates(false);
    setSelectedMonth(0);
    setSelectedYear(2026);
    setFormData({...formData, startDate: '', endDate: ''});
    setHoveredDate(null);
  };

  const updateWeekdaySchedule = (day, field, value) => {
    setFormData({
      ...formData,
      weekdaySchedule: {
        ...formData.weekdaySchedule,
        [day]: {
          ...formData.weekdaySchedule[day],
          [field]: value
        }
      }
    });
  };

  const getAvailableYears = () => {
    const years = new Set([2026, 2027, 2028]);
    events.forEach(event => {
      const startYear = new Date(event.startDate + 'T00:00:00').getFullYear();
      const endYear = new Date(event.endDate + 'T00:00:00').getFullYear();
      years.add(startYear);
      years.add(endYear);
    });
    return Array.from(years).sort();
  };

  const getMonthsToDisplay = () => {
    if (filterMonth === 'all') {
      return Array.from({ length: 12 }, (_, i) => i);
    }
    return [parseInt(filterMonth)];
  };

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const renderMonthMini = (monthIndex, year) => {
    const daysInMonth = getDaysInMonth(monthIndex, year);
    const firstDay = getFirstDayOfMonth(monthIndex, year);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={'empty-' + i} className="h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = year + '-' + String(monthIndex + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      const isSelecting = formData.startDate && !formData.endDate;
      const isInRange = isSelecting && hoveredDate && isDateBetween(dateStr, formData.startDate, hoveredDate);
      const isStart = dateStr === formData.startDate;
      const isEnd = dateStr === hoveredDate && isSelecting;
      
      const classList = ['h-8', 'border', 'border-gray-300', 'text-xs', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'transition-colors', 'rounded'];
      
      if (isInRange) classList.push('bg-indigo-100');
      else classList.push('bg-white');
      
      if (isStart || isEnd) {
        classList.push('bg-indigo-600', 'text-white', 'font-bold', 'ring-2', 'ring-indigo-700');
      } else {
        classList.push('text-gray-700');
      }
      
      classList.push('hover:bg-indigo-50', 'hover:border-indigo-300');
      
      days.push(
        <div 
          key={day} 
          className={classList.join(' ')}
          onClick={() => handleDateClick(dateStr)}
          onMouseEnter={() => formData.startDate && !formData.endDate && setHoveredDate(dateStr)}
        >
          {day}
        </div>
      );
    }

    return (
      <div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-bold text-gray-600 h-6 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const renderMonth = (monthIndex, year) => {
    const daysInMonth = getDaysInMonth(monthIndex, year);
    const firstDay = getFirstDayOfMonth(monthIndex, year);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={'empty-' + i} className="aspect-square"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = year + '-' + String(monthIndex + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      const dayEvents = getEventsForDate(dateStr);
      
      days.push(
        <div key={day} className="aspect-square border border-gray-200 p-1 text-sm relative overflow-hidden">
          <div className="font-medium text-gray-700">{day}</div>
          <div className="flex flex-wrap gap-0.5 mt-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className="h-2 flex-1 rounded"
                style={{ backgroundColor: event.color }}
                title={event.title}
              ></div>
            ))}
          </div>
          {dayEvents.length > 2 && (
            <div className="text-xs text-gray-500 absolute bottom-0 right-1">+{dayEvents.length - 2}</div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-lg mb-3 text-gray-800">{months[monthIndex]} {year}</h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 pb-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            {logoUrl ? (
              <div className="mb-4 flex justify-center">
                <img src={logoUrl} alt="Logo" className="max-h-24 sm:max-h-32 w-auto object-contain" />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
              </div>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sistema de Calendário</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">São Paulo Skills - Ciclo 2026-2028</p>
          </div>
          
          {loginError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{loginError}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuário
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => {
                  setLoginData({...loginData, username: e.target.value});
                  setLoginError(''); // Limpar erro ao digitar
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Digite seu usuário"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({...loginData, password: e.target.value});
                    setLoginError(''); // Limpar erro ao digitar
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showAdminPanel && currentUser?.role === 'admin') {
    console.log('Renderizando painel admin. Users no estado:', users);
    console.log('Quantidade de usuários:', users.length);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Painel Administrativo</h1>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="flex items-center gap-2 bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Voltar ao Calendário</span>
                <span className="sm:hidden">Voltar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Logo do Sistema
                </h2>
                {logoUrl && (
                  <div className="mb-4">
                    <img src={logoUrl} alt="Logo atual" className="max-h-32 mx-auto" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full text-xs sm:text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="border rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    Usuários do Sistema
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full ml-2">
                      {users.length} {users.length === 1 ? 'usuário' : 'usuários'}
                    </span>
                  </h2>
                  <button
                    onClick={() => {
                      console.log('Botão Novo usuário clicado');
                      setShowUserModal(true);
                    }}
                    className="flex items-center gap-1 bg-indigo-600 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-indigo-700 text-xs sm:text-sm"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Novo
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {users.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">Nenhum usuário cadastrado</p>
                  ) : (
                    users.map((user, index) => (
                      <div key={`user-${user.id}-${index}-${user.username}`} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{user.name}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                          </span>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              console.log('Editando usuário:', user);
                              setEditingUser(user);
                              setUserFormData({...user});
                              setShowUserModal(true);
                            }}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                            title={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1 ? 'Não é possível excluir o único administrador' : 'Excluir usuário'}
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div className="border rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                    Tipos de Eventos
                  </h2>
                  <button
                    onClick={() => setShowTypeModal(true)}
                    className="flex items-center gap-1 bg-indigo-600 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-indigo-700 text-xs sm:text-sm"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Novo
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {eventTypes.map(type => (
                    <div key={type.value} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded flex-shrink-0"
                          style={{ backgroundColor: type.defaultColor }}
                        ></div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{type.label}</p>
                          <p className="text-xs text-gray-500 truncate">{type.value}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingType(type);
                            setTypeFormData(type);
                            setShowTypeModal(true);
                          }}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteType(type.value)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                    setUserFormData({ username: '', password: '', name: '', role: 'user' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="ex: João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome de Usuário *
                  </label>
                  <input
                    type="text"
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({...userFormData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                    disabled={!!editingUser}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    placeholder="ex: joaosilva"
                  />
                  {editingUser && (
                    <p className="text-xs text-gray-500 mt-1">O nome de usuário não pode ser alterado</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder={editingUser ? "Deixe em branco para não alterar" : "Digite a senha"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Usuário *
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="user">Usuário Comum</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Administradores podem gerenciar eventos, usuários e configurações
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      console.log('Botão CANCELAR clicado');
                      setShowUserModal(false);
                      setEditingUser(null);
                      setUserFormData({ username: '', password: '', name: '', role: 'user' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      console.log('🔥🔥🔥 Botão CRIAR/ATUALIZAR clicado!');
                      console.log('Estado atual do formulário:', userFormData);
                      handleUserSubmit();
                    }}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
                  >
                    {editingUser ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showTypeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {editingType ? 'Editar Tipo' : 'Novo Tipo de Evento'}
                </h2>
                <button
                  onClick={() => {
                    setShowTypeModal(false);
                    setEditingType(null);
                    setTypeFormData({ value: '', label: '', defaultColor: '#3b82f6' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identificador (sem espaços)
                  </label>
                  <input
                    type="text"
                    value={typeFormData.value}
                    onChange={(e) => setTypeFormData({...typeFormData, value: e.target.value.toLowerCase().replace(/\s/g, '_')})}
                    disabled={!!editingType}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="ex: prova"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Tipo
                  </label>
                  <input
                    type="text"
                    value={typeFormData.label}
                    onChange={(e) => setTypeFormData({...typeFormData, label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="ex: Prova"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cor Padrão
                  </label>
                  <input
                    type="color"
                    value={typeFormData.defaultColor}
                    onChange={(e) => setTypeFormData({...typeFormData, defaultColor: e.target.value})}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowTypeModal(false);
                      setEditingType(null);
                      setTypeFormData({ value: '', label: '', defaultColor: '#3b82f6' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleTypeSubmit}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
                  >
                    {editingType ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6">
          {/* Header com logo e título */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 sm:h-16 object-contain" />
              ) : (
                <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600" />
              )}
              <div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800">Calendário São Paulo Skills</h1>
                <p className="text-xs sm:text-sm text-gray-600">Ciclo 2026-2028</p>
              </div>
            </div>
            
            {/* Menu mobile hamburger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Botões desktop */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {currentUser?.name} ({currentUser?.role === 'admin' ? 'Admin' : 'Usuário'})
                </span>
              </div>
              
              {currentUser?.role === 'admin' && (
                <>
                  <button
                    onClick={() => setShowAdminPanel(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xl:inline">Novo Evento</span>
                    <span className="xl:hidden">Novo</span>
                  </button>
                </>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          {/* Menu mobile dropdown */}
          {showMobileMenu && (
            <div className="lg:hidden mb-4 pb-4 border-b space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.name} ({currentUser?.role === 'admin' ? 'Admin' : 'Usuário'})
                </span>
              </div>
              
              {currentUser?.role === 'admin' && (
                <>
                  <button
                    onClick={() => {
                      setShowAdminPanel(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition text-sm justify-center"
                  >
                    <Settings className="w-5 h-5" />
                    Painel Admin
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition text-sm justify-center"
                  >
                    <Plus className="w-5 h-5" />
                    Novo Evento
                  </button>
                </>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition text-sm justify-center"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          )}

          {/* Filtros */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Ano:</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Mês:</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="all">Todos os meses</option>
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de eventos */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">Eventos Agendados</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm">Nenhum evento agendado</p>
              ) : (
                events.map(event => {
                  const hasSchedule = Object.values(event.weekdaySchedule).some(day => day.enabled);
                  const eventType = eventTypes.find(t => t.value === event.type);
                  return (
                    <div
                      key={event.id}
                      className="flex items-start sm:items-center justify-between p-3 rounded-lg border gap-2"
                      style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{event.title}</h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 w-fit">
                            {eventType?.label || event.type}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date(event.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} - {new Date(event.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </p>
                        {hasSchedule && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Horários configurados
                          </div>
                        )}
                        {event.notes && <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{event.notes}</p>}
                      </div>
                      {currentUser?.role === 'admin' && (
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              setFormData(event);
                              setEditingEvent(event);
                              setShowModal(true);
                            }}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Grid de calendários */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {getMonthsToDisplay().map((monthIndex) => renderMonth(monthIndex, filterYear))}
        </div>
      </div>

      {/* Modal de novo/editar evento */}
      {showModal && currentUser?.role === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-4 sm:my-8">
            <div className="p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-4 border-b">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    placeholder="Nome do evento"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => {
                        const type = eventTypes.find(t => t.value === e.target.value);
                        setFormData({...formData, type: e.target.value, color: type?.defaultColor || '#3b82f6'});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cor
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="border-2 border-indigo-200 rounded-lg p-3 sm:p-4 bg-indigo-50">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Selecionar Período *
                  </label>
                  
                  {!isSelectingDates && !formData.startDate && (
                    <button
                      type="button"
                      onClick={startDateSelection}
                      className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm sm:text-base"
                    >
                      📅 Clique para selecionar as datas
                    </button>
                  )}

                  {isSelectingDates && !formData.startDate && (
                    <div className="space-y-3">
                      <p className="text-center text-indigo-700 font-medium text-sm">
                        Clique em um dia para selecionar a data de início
                      </p>
                      <button
                        type="button"
                        onClick={cancelDateSelection}
                        className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}

                  {isSelectingDates && formData.startDate && !formData.endDate && (
                    <div className="space-y-3">
                      <p className="text-center text-indigo-700 font-medium text-sm">
                        📅 Início: {new Date(formData.startDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-center text-xs sm:text-sm text-gray-600">
                        Agora clique na data de término
                      </p>
                      <button
                        type="button"
                        onClick={cancelDateSelection}
                        className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}

                  {formData.startDate && formData.endDate && (
                    <div className="space-y-3">
                      <div className="text-center bg-white rounded-lg p-3 border-2 border-indigo-300">
                        <p className="text-indigo-700 font-bold text-sm sm:text-lg">
                          📅 {new Date(formData.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} até {new Date(formData.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={startDateSelection}
                        className="w-full px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium"
                      >
                        Alterar datas
                      </button>
                    </div>
                  )}
                </div>

                {isSelectingDates && (
                  <div className="border-2 border-indigo-300 rounded-lg p-3 bg-gradient-to-br from-indigo-50 to-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={goToPreviousMonth}
                        className="px-2 sm:px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs sm:text-sm font-medium flex items-center gap-1"
                      >
                        <span>←</span> <span className="hidden sm:inline">Ant</span>
                      </button>
                      <h3 className="font-bold text-indigo-800 text-sm sm:text-base">
                        {months[selectedMonth]} {selectedYear}
                      </h3>
                      <button
                        type="button"
                        onClick={goToNextMonth}
                        className="px-2 sm:px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs sm:text-sm font-medium flex items-center gap-1"
                      >
                        <span className="hidden sm:inline">Prox</span> <span>→</span>
                      </button>
                    </div>
                    <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg">
                      {renderMonthMini(selectedMonth, selectedYear)}
                    </div>
                  </div>
                )}

                {formData.startDate && formData.endDate && (
                  <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Horários por Dia da Semana (Opcional)</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">
                      Configure horários específicos para cada dia da semana durante o período do evento
                    </p>
                    <div className="space-y-3">
                      {Object.entries(weekdayNames).map(([key, name]) => (
                        <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 border rounded bg-white">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.weekdaySchedule[key].enabled}
                              onChange={(e) => updateWeekdaySchedule(key, 'enabled', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-xs sm:text-sm font-medium text-gray-700">{name}</span>
                          </div>
                          {formData.weekdaySchedule[key].enabled && (
                            <div className="flex items-center gap-2 flex-1 ml-6 sm:ml-0">
                              <input
                                type="time"
                                value={formData.weekdaySchedule[key].startTime}
                                onChange={(e) => updateWeekdaySchedule(key, 'startTime', e.target.value)}
                                className="flex-1 sm:flex-none px-2 py-1 border rounded text-xs sm:text-sm"
                              />
                              <span className="text-gray-500 text-xs sm:text-sm">até</span>
                              <input
                                type="time"
                                value={formData.weekdaySchedule[key].endTime}
                                onChange={(e) => updateWeekdaySchedule(key, 'endTime', e.target.value)}
                                className="flex-1 sm:flex-none px-2 py-1 border rounded text-xs sm:text-sm"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    rows="3"
                    placeholder="Informações adicionais..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="w-full sm:flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSaving ? 'Salvando...' : (editingEvent ? 'Atualizar' : 'Criar')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSystem;
