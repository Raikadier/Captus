// GroupsPage - Team collaboration and group management
import React, { useState, useEffect } from 'react';
import { Users, Plus, MessageCircle, Calendar, CheckSquare } from 'lucide-react';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Mock groups data - TODO: Replace with API call
  useEffect(() => {
    const mockGroups = [
      {
        id: 1,
        name: 'Equipo de Desarrollo',
        description: 'Grupo para coordinar tareas de desarrollo',
        members: 5,
        tasks: 12,
        created_at: '2024-01-15T10:30:00Z',
        lastActivity: '2024-10-18T14:30:00Z'
      },
      {
        id: 2,
        name: 'Proyecto Marketing',
        description: 'Campañas y estrategias de marketing',
        members: 3,
        tasks: 8,
        created_at: '2024-02-20T09:15:00Z',
        lastActivity: '2024-10-17T16:45:00Z'
      },
      {
        id: 3,
        name: 'Estudio y Aprendizaje',
        description: 'Grupo para compartir recursos de estudio',
        members: 7,
        tasks: 15,
        created_at: '2024-03-10T11:00:00Z',
        lastActivity: '2024-10-18T12:20:00Z'
      }
    ];
    setGroups(mockGroups);
  }, []);

  const handleCreateGroup = () => {
    // TODO: Implement create group functionality
    alert('Funcionalidad de crear grupo próximamente');
    setShowCreateForm(false);
  };

  const handleJoinGroup = (groupId) => {
    // TODO: Implement join group functionality
    alert(`Unirse al grupo ${groupId} próximamente`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Grupos de Trabajo</h1>
              <p className="text-green-100">Colabora con tu equipo</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Crear Grupo
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Grupos</p>
                <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mensajes</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center">
              <CheckSquare className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tareas Compartidas</p>
                <p className="text-2xl font-bold text-gray-900">{groups.reduce((sum, group) => sum + group.tasks, 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Miembros Totales</p>
                <p className="text-2xl font-bold text-gray-900">{groups.reduce((sum, group) => sum + group.members, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedGroup(group)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-500">
                        {group.members} miembros
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {group.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{group.tasks} tareas</span>
                  <span>
                    Activo {new Date(group.lastActivity).toLocaleDateString('es-ES')}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinGroup(group.id);
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Unirse
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGroup(group);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {groups.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-24 w-24 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No hay grupos aún</h3>
            <p className="mt-2 text-gray-500">
              Crea tu primer grupo para comenzar a colaborar con tu equipo
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear Grupo
            </button>
          </div>
        )}

        {/* Create Group Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Grupo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Grupo
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Ingresa el nombre del grupo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Describe el propósito del grupo"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Crear Grupo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group Details Modal */}
        {selectedGroup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedGroup.name}</h3>
                      <p className="text-gray-600">{selectedGroup.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedGroup.members}</div>
                    <div className="text-sm text-green-700">Miembros</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedGroup.tasks}</div>
                    <div className="text-sm text-blue-700">Tareas</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Date(selectedGroup.created_at).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-sm text-purple-700">Creado</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Funcionalidades Próximas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-blue-500 mb-2" />
                      <h5 className="font-medium text-gray-900">Chat del Grupo</h5>
                      <p className="text-sm text-gray-600">Comunicación en tiempo real con los miembros</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <CheckSquare className="w-6 h-6 text-green-500 mb-2" />
                      <h5 className="font-medium text-gray-900">Tareas Compartidas</h5>
                      <p className="text-sm text-gray-600">Asigna y sigue tareas del equipo</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-500 mb-2" />
                      <h5 className="font-medium text-gray-900">Calendario Compartido</h5>
                      <p className="text-sm text-gray-600">Coordina eventos y reuniones</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <Users className="w-6 h-6 text-orange-500 mb-2" />
                      <h5 className="font-medium text-gray-900">Gestión de Miembros</h5>
                      <p className="text-sm text-gray-600">Invita y administra miembros del grupo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
